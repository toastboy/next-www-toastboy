import 'server-only';

import { sendEmailToAllActivePlayers } from '@/actions/sendEmailToAllActivePlayers';
import { InternalError, NotFoundError, ValidationError } from '@/lib/errors';
import { getPublicBaseUrl } from '@/lib/urls';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { SendEmailToAllActivePlayersProxy } from '@/types/actions/SendEmailToAllActivePlayers';
import type { SubmitPickerInput } from '@/types/actions/SubmitPicker';

interface SubmitPickerDeps {
    gameDayService: Pick<typeof gameDayService, 'getCurrent'>;
    outcomeService: Pick<
        typeof outcomeService,
        | 'getAdminByGameDay'
        | 'getPlayerGamesPlayedBeforeGameDay'
        | 'getRecentAverage'
        | 'upsert'
    >;
    sendEmailToAllActivePlayers: SendEmailToAllActivePlayersProxy;
    getPublicBaseUrl: () => string;
}

const defaultDeps: SubmitPickerDeps = {
    gameDayService,
    outcomeService,
    sendEmailToAllActivePlayers,
    getPublicBaseUrl,
};

interface PickerCandidate {
    playerId: number;
    name: string;
    goalie: boolean;
    average: number;
    age: number | null;
}

interface TeamDiffs {
    diffGoalies: number;
    diffAverage: number;
    diffUnknownAge: number;
    diffAge: number;
}

interface TeamSplit {
    teamA: PickerCandidate[];
    teamB: PickerCandidate[];
    diffs: TeamDiffs;
}

/**
 * Compares two numbers using an epsilon tolerance to account for floating-point
 * imprecision.
 *
 * @param a - The first number to compare.
 * @param b - The second number to compare.
 * @param epsilon - The maximum allowed difference to consider the numbers
 * equal.
 * @returns `0` if the numbers are within `epsilon`, `-1` if `a` is less than
 * `b`, or `1` if `a` is greater than `b`.
 */
const compareNumber = (a: number, b: number, epsilon = 1e-9) => {
    const delta = a - b;
    if (Math.abs(delta) <= epsilon) return 0;
    return delta < 0 ? -1 : 1;
};

/**
 * Computes the total of all numeric values in the provided array.
 *
 * @param values - The list of numbers to add together.
 * @returns The sum of all numbers in the array.
 */
const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

/**
 * Iterates over all combinations of k items from a given array and invokes a
 * callback for each combination.
 *
 * @template T - The type of items in the array.
 * @param k - The size of each combination (number of items to include).
 * @param items - The array of items to generate combinations from.
 * @param callback - Function invoked for each combination, receiving:
 *   - `included` - Array of items included in the current combination.
 *   - `excluded` - Array of items excluded from the current combination.
 *   - `includedIndexes` - Indexes of included items in the original array.
 *   - `includedMask` - Bitmask representation of included item positions.
 * @param mirror - If true, only evaluates combinations where the first item
 *   (items[0]) is included, yielding exactly one representative per mirrored
 *   pair. Defaults to true.
 *
 * @example
 * ```typescript
 * combForeach(2, ['a', 'b', 'c'], (included, excluded, indexes, mask) => {
 *   console.log(included); // ['a', 'b'], ['a', 'c'], ['b', 'c']
 * });
 * ```
 */
const combForeach = <T>(
    k: number,
    items: T[],
    callback: (
        included: T[],
        excluded: T[],
        includedIndexes: number[],
        includedMask: bigint,
    ) => void,
    mirror = true,
) => {
    const n = items.length;
    /* v8 ignore next -- defensive guard for direct helper use */
    if (k < 0 || k > n) return;

    const included: T[] = [];
    const includedIndexes: number[] = [];

    const emitSplit = () => {
        const excluded: T[] = [];
        let includedCursor = 0;

        for (let index = 0; index < n; index++) {
            if (includedIndexes[includedCursor] === index) {
                includedCursor++;
            } else {
                excluded.push(items[index]);
            }
        }

        let includedMask = 0n;
        for (const index of includedIndexes) {
            includedMask |= 1n << BigInt(index);
        }

        callback([...included], excluded, [...includedIndexes], includedMask);
    };

    const walk = (start: number, needed: number) => {
        if (needed === 0) {
            emitSplit();
            return;
        }

        for (let index = start; index <= n - needed; index++) {
            included.push(items[index]);
            includedIndexes.push(index);
            walk(index + 1, needed - 1);
            included.pop();
            includedIndexes.pop();
        }
    };

    // Even squad: the two sides are the same size, so {A,B} and {B,A} are the
    // same split. Pin item[0] to the included side to evaluate one
    // representative per mirrored pair. Odd squad: the sides differ in size
    // and are not interchangeable, so every combination is evaluated.
    if (mirror) {
        /* v8 ignore next -- cannot occur with validated team sizes */
        if (k === 0 || n === 0) return;
        included.push(items[0]);
        includedIndexes.push(0);
        walk(1, k - 1);
        return;
    }

    walk(0, k);
};

/**
 * Calculates the differences between two teams across multiple metrics.
 *
 * For an odd squad the two teams are unequal — the larger side fields
 * `onPitch` players and rotates the rest through a substitute. Each cumulative
 * metric (average, age, unknown-age count) is therefore scaled by that team's
 * time-averaged on-pitch share, `onPitch / teamSize`, so the comparison is
 * between the strength actually on the pitch rather than raw squad totals. For
 * an even squad both teams field their whole side, the scale is 1, and this
 * reduces exactly to summed differences. Goalie count is a structural
 * constraint, not a pitch-time quantity, so it is compared unscaled.
 *
 * @param teamA - The first team of picker candidates
 * @param teamB - The second team of picker candidates
 * @param unknownAgeValue - The numeric value to use for players with unknown
 * age
 * @param onPitch - Players fielded per side (`⌊squad / 2⌋`)
 * @returns An object containing the differences in goalies, average skill,
 * unknown age count, and total age between the two teams
 */
const calculateDiffs = (
    teamA: PickerCandidate[],
    teamB: PickerCandidate[],
    unknownAgeValue: number,
    onPitch: number,
): TeamDiffs => {
    const scaleA = onPitch / teamA.length;
    const scaleB = onPitch / teamB.length;

    const teamAGoalies = sum(teamA.map((player) => (player.goalie ? 1 : 0)));
    const teamBGoalies = sum(teamB.map((player) => (player.goalie ? 1 : 0)));
    const teamAAverage = scaleA * sum(teamA.map((player) => player.average));
    const teamBAverage = scaleB * sum(teamB.map((player) => player.average));
    const teamAUnknownAge =
        scaleA * sum(teamA.map((player) => (player.age === null ? 1 : 0)));
    const teamBUnknownAge =
        scaleB * sum(teamB.map((player) => (player.age === null ? 1 : 0)));
    const teamAAge =
        scaleA * sum(teamA.map((player) => player.age ?? unknownAgeValue));
    const teamBAge =
        scaleB * sum(teamB.map((player) => player.age ?? unknownAgeValue));

    return {
        diffGoalies: teamAGoalies - teamBGoalies,
        diffAverage: teamAAverage - teamBAverage,
        diffUnknownAge: teamAUnknownAge - teamBUnknownAge,
        diffAge: teamAAge - teamBAge,
    };
};

const compareDiffs = (left: TeamDiffs, right: TeamDiffs) => {
    // Lexicographic order:
    //   ABS(diff_goalies), ABS(diff_average), ABS(diff_unknown_age),
    //   ABS(diff_age)
    //
    // Legacy picker_best_teams also ranked ABS(diff_played) second (between
    // goalies and average). It is deliberately omitted: replaying every
    // historical game showed the played term moved teams further from the
    // stored (often hand-adjusted) splits than the average-first order does,
    // and adds no fairness the recent-average metric doesn't already capture.
    const comparisons = [
        compareNumber(Math.abs(left.diffGoalies), Math.abs(right.diffGoalies)),
        compareNumber(Math.abs(left.diffAverage), Math.abs(right.diffAverage)),
        compareNumber(
            Math.abs(left.diffUnknownAge),
            Math.abs(right.diffUnknownAge),
        ),
        compareNumber(Math.abs(left.diffAge), Math.abs(right.diffAge)),
    ];

    for (const result of comparisons) {
        if (result !== 0) return result;
    }

    return 0;
};

/**
 * Finds the optimal split of players into two balanced teams.
 *
 * Evaluates every way to divide the squad into two sides that differ in size
 * by at most one and selects the one that minimises the team differences
 * (goalies, then skill, then age) via {@link compareDiffs}. When several splits
 * tie, the lexicographically smallest team-A bitmask wins, for determinism.
 *
 * For an odd squad `teamA` is the larger side (it carries the rotating
 * substitute); {@link calculateDiffs} scales each side by its on-pitch share
 * so the balance is judged on who is actually playing at any moment.
 *
 * @param players - Candidates to split. At least 2; any parity.
 * @returns A {@link TeamSplit} with the two teams and their diffs.
 * @throws {ValidationError} If fewer than two players are given.
 * @throws {InternalError} If no split could be determined (unreachable for
 * valid input).
 *
 * @remarks
 * - An average of the known ages stands in for players with unknown age.
 * - {@link combForeach} enumerates the combinations by bitmask; for an even
 *   squad it uses mirrored evaluation (one representative per pair), for an
 *   odd squad the two sides are distinguishable by size so every combination
 *   is evaluated.
 */
const findBestSplit = (players: PickerCandidate[]): TeamSplit => {
    /* v8 ignore next -- upstream selection always passes arrays of >= 2 */
    if (players.length < 2) {
        throw new ValidationError(
            'Cannot split teams: expected at least two players.',
        );
    }

    const onPitch = Math.floor(players.length / 2);
    const teamASize = Math.ceil(players.length / 2);
    const evenSquad = players.length % 2 === 0;
    const knownAges = players
        .map((player) => player.age)
        .filter((age): age is number => age !== null);
    const averageKnownAge =
        knownAges.length > 0 ? sum(knownAges) / knownAges.length : 0;

    let bestSplit: TeamSplit | null = null;
    let bestSplitMask: bigint | null = null;
    combForeach(
        teamASize,
        players,
        (teamA, teamB, _teamAIndexes, teamAMask) => {
            const diffs = calculateDiffs(
                teamA,
                teamB,
                averageKnownAge,
                onPitch,
            );

            if (!bestSplit) {
                bestSplit = { teamA, teamB, diffs };
                bestSplitMask = teamAMask;
                return;
            }

            const diffComparison = compareDiffs(diffs, bestSplit.diffs);
            if (
                diffComparison < 0 ||
                (diffComparison === 0 &&
                    bestSplitMask !== null &&
                    teamAMask < bestSplitMask)
            ) {
                bestSplit = { teamA, teamB, diffs };
                bestSplitMask = teamAMask;
            }
        },
        evenSquad,
    );

    /* v8 ignore next -- combForeach always emits at least one split for valid input */
    if (!bestSplit) {
        throw new InternalError('Unable to determine balanced teams.');
    }

    return bestSplit;
};

/**
 * Builds an HTML email message for team selection notification.
 *
 * Generates a formatted email containing the two teams that have been picked
 * for a game, including clickable links to each player's profile page.
 *
 * @param options - The configuration object
 * @param options.gameDayId - The unique identifier for the game day
 * @param options.teamA - Array of players assigned to Team A
 * @param options.teamB - Array of players assigned to Team B
 * @param options.baseUrl - The base URL for constructing player and game page
 * links
 * @returns An HTML string formatted as an email body containing team
 *          information, player links, and a reference to the game page
 */
const buildTeamEmail = ({
    gameDayId,
    teamA,
    teamB,
    baseUrl,
}: {
    gameDayId: number;
    teamA: PickerCandidate[];
    teamB: PickerCandidate[];
    baseUrl: string;
}) => {
    const gameUrl = `${baseUrl}/footy/game/${gameDayId}`;
    const formatPlayerLinks = (players: PickerCandidate[]) =>
        players
            .slice()
            .sort((left, right) => left.name.localeCompare(right.name))
            .map(
                (player) =>
                    `<a href="${baseUrl}/footy/player/${player.playerId}">${player.name}</a>`,
            )
            .join('<br />\n');

    return [
        '<div>',
        `<p>The teams for game ${gameDayId} have been picked. They are:</p>`,
        '<p><strong>Team A</strong><br />',
        `${formatPlayerLinks(teamA)}`,
        '</p>',
        '<p><strong>vs</strong></p>',
        '<p><strong>Team B</strong><br />',
        `${formatPlayerLinks(teamB)}`,
        '</p>',
        '<p>Remember you can still change your response if you need to, whether you are in the game or not. ',
        'If players withdraw or new ones come along, the teams may be re-picked.</p>',
        `<p>Visit the game page at <a href="${gameUrl}">${gameUrl}</a>.</p>`,
        '<p>Cheers,<br />Jon</p>',
        '</div>',
    ].join('\n');
};

/**
 * Core logic for submitting team picker selections and assigning players to teams.
 *
 * This function performs the following operations:
 * 1. Validates that at least two players are selected
 * 2. Retrieves the current game day and player outcomes
 * 3. Clears existing team assignments for all eligible players
 * 4. Validates selected players have 'Yes' responses
 * 5. Calculates player statistics (average performance, age, position)
 * 6. Determines optimal team split based on player averages
 * 7. Assigns players to teams and persists assignments
 * 8. Sends email notification to all active players with team assignments
 *
 * @param data - Array of picker inputs containing player selections and metadata
 * @param deps - Service dependencies for game day, outcomes, email, and configuration (defaults provided)
 * @returns Promise that resolves when team assignments are complete and notifications sent
 * @throws {ValidationError} If fewer than two players are selected.
 * @throws {NotFoundError} If no current game day is available.
 * @throws {ValidationError} If a selected player is not available for the game day.
 * @throws {ValidationError} If a selected player has not confirmed participation with 'Yes'.
 */
export async function coreSubmitPicker(
    data: SubmitPickerInput,
    deps: SubmitPickerDeps = defaultDeps,
): Promise<void> {
    const selectedPlayerIds = Array.from(
        new Set(data.map((item) => item.playerId)),
    );
    if (selectedPlayerIds.length < 2) {
        throw new ValidationError(
            'At least two players are required to pick teams.',
        );
    }

    const gameDay = await deps.gameDayService.getCurrent();
    if (!gameDay) {
        throw new NotFoundError(
            'No current game day available for picking teams.',
        );
    }

    const history = gameDay.pickerGamesHistory ?? 10;
    // Filter the roster by who had not finished as of the game day itself, so
    // replaying a historical game isn't broken by players who have left since.
    const outcomes = await deps.outcomeService.getAdminByGameDay(
        gameDay.id,
        gameDay.date,
    );

    // Legacy `game_reset_teams`: clear teams for the whole game before re-picking.
    await Promise.all(
        outcomes
            .filter((outcome) => outcome.id > 0)
            .map((outcome) =>
                deps.outcomeService.upsert({
                    gameDayId: gameDay.id,
                    playerId: outcome.playerId,
                    team: null,
                }),
            ),
    );

    const selectedOutcomes = selectedPlayerIds.map((playerId) => {
        const row = outcomes.find((outcome) => outcome.playerId === playerId);
        if (!row) {
            throw new ValidationError(
                `Selected player ${playerId} is not available for this game day.`,
            );
        }
        if (row.response !== 'Yes') {
            throw new ValidationError(
                `Selected player ${playerId} does not have a 'Yes' response.`,
            );
        }
        return row;
    });

    const candidates = await Promise.all(
        selectedOutcomes.map(async (row) => {
            const average = await deps.outcomeService.getRecentAverage(
                gameDay.id,
                row.playerId,
                history,
            );
            const born = row.player.born ?? null;
            const age =
                born !== null && born < 1995 ? gameDay.year - born : null;
            return {
                playerId: row.playerId,
                name: row.player.name ?? `Player ${row.playerId}`,
                goalie: row.goalie === true,
                average,
                age,
            } satisfies PickerCandidate;
        }),
    );

    const { teamA, teamB } = findBestSplit(candidates);

    const teamAssignments = new Map<number, 'A' | 'B'>();
    for (const player of teamA) {
        teamAssignments.set(player.playerId, 'A');
    }
    for (const player of teamB) {
        teamAssignments.set(player.playerId, 'B');
    }

    await Promise.all(
        Array.from(teamAssignments.entries()).map(([playerId, team]) =>
            deps.outcomeService.upsert({
                gameDayId: gameDay.id,
                playerId,
                team,
            }),
        ),
    );

    const baseUrl = deps.getPublicBaseUrl();
    await deps.sendEmailToAllActivePlayers({
        subject: 'Footy: teams picked',
        html: buildTeamEmail({
            gameDayId: gameDay.id,
            teamA,
            teamB,
            baseUrl,
        }),
    });
}

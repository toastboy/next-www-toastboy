import 'server-only';

import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';
import { InternalError, NotFoundError, ValidationError } from '@/lib/errors';
import { getPublicBaseUrl } from '@/lib/urls';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { SendEmailToAllActivePlayersProxy } from '@/types/actions/SendEmailToAllActivePlayers';
import type { SubmitPickerInput } from '@/types/actions/SubmitPicker';

interface SubmitPickerDeps {
    gameDayService: Pick<typeof gameDayService, 'getCurrent'>;
    outcomeService: Pick<typeof outcomeService, 'getAdminByGameDay' | 'getPlayerGamesPlayedBeforeGameDay' | 'getRecentAverage' | 'upsert'>;
    sendEmailToAllActivePlayers: SendEmailToAllActivePlayersProxy;
    getPublicBaseUrl: () => string;
}

const defaultDeps: SubmitPickerDeps = {
    gameDayService,
    outcomeService,
    sendEmailToAllActivePlayers: sendEmailToAllActivePlayersCore,
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
 * Compares two nullable numbers, treating null values as coming first in sort
 * order.
 * @param a - The first number to compare, or null
 * @param b - The second number to compare, or null
 * @returns A negative number if a comes before b, 0 if equal, or a positive
 *          number if a comes after b. Null values are always sorted before
 *          non-null values.
 */
const compareNullableNumberNullsFirst = (a: number | null, b: number | null) => {
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    return compareNumber(a, b);
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
    callback: (included: T[], excluded: T[], includedIndexes: number[], includedMask: bigint) => void,
    mirror = true,
) => {
    const n = items.length;
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

    // For mirrored team splits, only evaluate combinations where item[0] is
    // included. This yields exactly one representative per mirrored pair.
    if (mirror) {
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
 * @param teamA - The first team of picker candidates
 * @param teamB - The second team of picker candidates
 * @param unknownAgeValue - The numeric value to use for players with unknown
 * age
 * @returns An object containing the differences in goalies, average skill,
 * unknown age count, and total age between the two teams
 */
const calculateDiffs = (
    teamA: PickerCandidate[],
    teamB: PickerCandidate[],
    unknownAgeValue: number,
): TeamDiffs => {
    const teamAGoalies = sum(teamA.map((player) => player.goalie ? 1 : 0));
    const teamBGoalies = sum(teamB.map((player) => player.goalie ? 1 : 0));
    const teamAAverage = sum(teamA.map((player) => player.average));
    const teamBAverage = sum(teamB.map((player) => player.average));
    const teamAUnknownAge = sum(teamA.map((player) => player.age === null ? 1 : 0));
    const teamBUnknownAge = sum(teamB.map((player) => player.age === null ? 1 : 0));
    const teamAAge = sum(teamA.map((player) => player.age ?? unknownAgeValue));
    const teamBAge = sum(teamB.map((player) => player.age ?? unknownAgeValue));

    return {
        diffGoalies: teamAGoalies - teamBGoalies,
        diffAverage: teamAAverage - teamBAverage,
        diffUnknownAge: teamAUnknownAge - teamBUnknownAge,
        diffAge: teamAAge - teamBAge,
    };
};

const compareDiffs = (left: TeamDiffs, right: TeamDiffs) => {
    // Mirrors legacy picker_best_teams ordering:
    // ABS(diff_goalies), ABS(diff_played), ABS(diff_average),
    // ABS(diff_unknown_age), ABS(diff_age)
    const comparisons = [
        compareNumber(Math.abs(left.diffGoalies), Math.abs(right.diffGoalies)),
        compareNumber(Math.abs(left.diffAverage), Math.abs(right.diffAverage)),
        compareNumber(Math.abs(left.diffUnknownAge), Math.abs(right.diffUnknownAge)),
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
 * The function evaluates all possible team combinations and selects the one that minimizes
 * the differences in team attributes (e.g., skill level, age). When multiple splits have
 * equal differences, the lexicographically smallest team mask is preferred for consistency.
 *
 * @param players - An array of player candidates to be split into teams. Must contain an even
 *                  number of at least 2 players.
 * @returns A {@link TeamSplit} object containing the two balanced teams (teamA and teamB) and
 *          their calculated differences.
 * @throws {ValidationError} If the number of players is less than 2 or not an even number.
 * @throws {InternalError} If unable to determine balanced teams (should not occur with valid input).
 *
 * @remarks
 * - The function calculates an average age from players with known ages to handle cases where
 *   some players may have null age values.
 * - Team balance is determined by comparing differences in various attributes using
 *   {@link calculateDiffs} and {@link compareDiffs}.
 * - The algorithm uses bitmasking via {@link combForeach} to efficiently iterate through
 *   all possible team combinations.
 */
const findBestSplit = (players: PickerCandidate[]): TeamSplit => {
    if (players.length < 2 || players.length % 2 !== 0) {
        throw new ValidationError('Cannot split teams: expected an even number of at least two players.');
    }

    const teamSize = players.length / 2;
    const knownAges = players
        .map((player) => player.age)
        .filter((age): age is number => age !== null);
    const averageKnownAge = knownAges.length > 0 ?
        sum(knownAges) / knownAges.length :
        0;

    let bestSplit: TeamSplit | null = null;
    let bestSplitMask: bigint | null = null;
    combForeach(teamSize, players, (teamA, teamB, _teamAIndexes, teamAMask) => {
        const diffs = calculateDiffs(teamA, teamB, averageKnownAge);

        if (!bestSplit) {
            bestSplit = { teamA, teamB, diffs };
            bestSplitMask = teamAMask;
            return;
        }

        const diffComparison = compareDiffs(diffs, bestSplit.diffs);
        if (diffComparison < 0 || (diffComparison === 0 && bestSplitMask !== null && teamAMask < bestSplitMask)) {
            bestSplit = { teamA, teamB, diffs };
            bestSplitMask = teamAMask;
        }
    });

    if (!bestSplit) {
        throw new InternalError('Unable to determine balanced teams.');
    }

    return bestSplit;
};

/**
 * Selects a middle outfield player from a list of candidates and returns the
 * remaining players.
 *
 * For even-sized lists, returns all players for splitting with no middle
 * player. For odd-sized lists, sorts players by goalie status, average, age,
 * and player ID, then selects the middle non-goalie player as the separator.
 *
 * @param players - Array of picker candidates to process
 * @returns An object containing:
 *   - playersForSplit: Array of players excluding the middle player
 *   - middlePlayer: The selected middle player, or null for even-sized lists
 * @throws {InternalError} If unable to select a middle player for odd-sized
 * lists.
 */
const selectMiddleOutfieldPlayer = (players: PickerCandidate[]) => {
    if (players.length % 2 === 0) {
        return { playersForSplit: players, middlePlayer: null as PickerCandidate | null };
    }

    let middle = Math.floor(players.filter((player) => !player.goalie).length / 2);
    const orderedPlayers = [...players].sort((left, right) =>
        compareNumber(left.goalie ? 1 : 0, right.goalie ? 1 : 0) ||
        compareNumber(left.average, right.average) ||
        compareNullableNumberNullsFirst(left.age, right.age) ||
        (left.playerId - right.playerId),
    );
    let middlePlayer: PickerCandidate | null = null;
    const playersForSplit: PickerCandidate[] = [];

    for (const player of orderedPlayers) {
        const removeCurrentPlayer = middlePlayer === null && middle === 0;
        middle--;
        if (removeCurrentPlayer) {
            middlePlayer = player;
        } else {
            playersForSplit.push(player);
        }
    }

    if (!middlePlayer) {
        throw new InternalError('Unable to select middle player for odd-sized picker list.');
    }

    return { playersForSplit, middlePlayer };
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
    const formatPlayerLinks = (players: PickerCandidate[]) => players
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((player) => `<a href="${baseUrl}/footy/player/${player.playerId}">${player.name}</a>`)
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
export async function SubmitPickerCore(
    data: SubmitPickerInput,
    deps: SubmitPickerDeps = defaultDeps,
): Promise<void> {
    const selectedPlayerIds = Array.from(new Set(data.map((item) => item.playerId)));
    if (selectedPlayerIds.length < 2) {
        throw new ValidationError('At least two players are required to pick teams.');
    }

    const gameDay = await deps.gameDayService.getCurrent();
    if (!gameDay) {
        throw new NotFoundError('No current game day available for picking teams.');
    }

    const history = gameDay.pickerGamesHistory ?? 10;
    const outcomes = await deps.outcomeService.getAdminByGameDay(gameDay.id);

    // Legacy `game_reset_teams`: clear teams for the whole game before re-picking.
    await Promise.all(outcomes
        .filter((outcome) => outcome.id > 0)
        .map((outcome) =>
            deps.outcomeService.upsert({
                gameDayId: gameDay.id,
                playerId: outcome.playerId,
                team: null,
            })));

    const selectedOutcomes = selectedPlayerIds.map((playerId) => {
        const row = outcomes.find((outcome) => outcome.playerId === playerId);
        if (!row) {
            throw new ValidationError(`Selected player ${playerId} is not available for this game day.`);
        }
        if (row.response !== 'Yes') {
            throw new ValidationError(`Selected player ${playerId} does not have a 'Yes' response.`);
        }
        return row;
    });

    const candidates = await Promise.all(selectedOutcomes.map(async (row) => {
        const average = await deps.outcomeService.getRecentAverage(gameDay.id, row.playerId, history);
        const born = row.player.born ?? null;
        const age = (born !== null && born < 1995) ? gameDay.year - born : null;
        return {
            playerId: row.playerId,
            name: row.player.name ?? `Player ${row.playerId}`,
            goalie: row.goalie === true,
            average,
            age,
        } satisfies PickerCandidate;
    }));

    const { playersForSplit, middlePlayer } = selectMiddleOutfieldPlayer(candidates);
    const split = findBestSplit(playersForSplit);
    let teamA = [...split.teamA];
    let teamB = [...split.teamB];

    if (middlePlayer) {
        const teamAAverage = sum(teamA.map((player) => player.average));
        const teamBAverage = sum(teamB.map((player) => player.average));

        if (teamAAverage < teamBAverage) {
            teamA = [...teamA, middlePlayer];
        } else {
            teamB = [...teamB, middlePlayer];
        }
    }

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
            })),
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

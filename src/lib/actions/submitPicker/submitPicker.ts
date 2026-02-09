import 'server-only';

import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';
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

const compareNumber = (a: number, b: number, epsilon = 1e-9) => {
    const delta = a - b;
    if (Math.abs(delta) <= epsilon) return 0;
    return delta < 0 ? -1 : 1;
};

const compareNullableNumberNullsFirst = (a: number | null, b: number | null) => {
    if (a === null && b === null) return 0;
    if (a === null) return -1;
    if (b === null) return 1;
    return compareNumber(a, b);
};

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const combLeastItem = (comb: number) => comb & -comb;

const combNext = (comb: number) => {
    const lobit = combLeastItem(comb);
    comb += lobit;
    let hibit = combLeastItem(comb);
    hibit -= lobit;

    while ((hibit & 1) === 0) {
        hibit >>= 1;
    }

    comb |= hibit >> 1;

    return comb;
};

const combForeach = <T>(
    k: number,
    items: T[],
    callback: (included: T[], excluded: T[]) => void,
    mirror = true,
) => {
    const n = items.length;
    if (k < 0 || k > n) return;

    const shifts: number[] = [];
    let mask = 1;
    for (let index = 0; index <= n; index++) {
        shifts[index] = mask;
        mask <<= 1;
    }

    const combLast = shifts[n] - shifts[n - k];
    const combFirst = shifts[k] - 1;

    for (let comb = combFirst; comb <= combLast;) {
        // For mirrored team splits, only evaluate combinations where item[0] is
        // included. This yields exactly one representative per mirrored pair.
        if (!mirror || (comb & shifts[0]) !== 0) {
            const included: T[] = [];
            const excluded: T[] = [];
            for (let index = 0; index < n; index++) {
                if ((comb & shifts[index]) !== 0) {
                    included.push(items[index]);
                } else {
                    excluded.push(items[index]);
                }
            }

            callback(included, excluded);
        }

        if (comb === combLast) break;
        comb = combNext(comb);
    }
};

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

const findBestSplit = (players: PickerCandidate[]): TeamSplit => {
    if (players.length < 2 || players.length % 2 !== 0) {
        throw new Error('Cannot split teams: expected an even number of at least two players.');
    }

    const teamSize = players.length / 2;
    const knownAges = players
        .map((player) => player.age)
        .filter((age): age is number => age !== null);
    const averageKnownAge = knownAges.length > 0 ?
        sum(knownAges) / knownAges.length :
        0;

    let bestSplit: TeamSplit | null = null;
    combForeach(teamSize, players, (teamA, teamB) => {
        const diffs = calculateDiffs(teamA, teamB, averageKnownAge);

        if (!bestSplit) {
            bestSplit = { teamA, teamB, diffs };
            return;
        }

        const diffComparison = compareDiffs(diffs, bestSplit.diffs);
        if (diffComparison < 0) {
            bestSplit = { teamA, teamB, diffs };
        }
    });

    if (!bestSplit) {
        throw new Error('Unable to determine balanced teams.');
    }

    return bestSplit;
};

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
        throw new Error('Unable to select middle player for odd-sized picker list.');
    }

    return { playersForSplit, middlePlayer };
};

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
 * Calculates and persists balanced teams for the current game.
 *
 * @param data - The picker input containing the selected players.
 * @param deps - Optional dependencies for easier testing.
 * @returns A promise resolving when the payload is accepted.
 */
export async function SubmitPickerCore(
    data: SubmitPickerInput,
    deps: SubmitPickerDeps = defaultDeps,
): Promise<void> {
    const selectedPlayerIds = Array.from(new Set(data.map((item) => item.playerId)));
    if (selectedPlayerIds.length < 2) {
        throw new Error('At least two players are required to pick teams.');
    }

    const gameDay = await deps.gameDayService.getCurrent();
    if (!gameDay) {
        throw new Error('No current game day available for picking teams.');
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
            throw new Error(`Selected player ${playerId} is not available for this game day.`);
        }
        if (row.response !== 'Yes') {
            throw new Error(`Selected player ${playerId} does not have a 'Yes' response.`);
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

import { describe, expect, it } from 'vitest';

import { SubmitPickerCore } from '@/lib/actions/submitPicker';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { SubmitPickerInput } from '@/types/actions/SubmitPicker';
import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

const shouldRunIntegration = process.env.RUN_PICKER_INTEGRATION === 'true' && !!process.env.DATABASE_URL;
const describeIntegration = shouldRunIntegration ? describe : describe.skip;

const parseGameIds = () => {
    const raw = process.env.PICKER_PARITY_GAME_IDS?.trim();
    if (!raw) return [1249];

    const ids = raw
        .split(',')
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter(Number.isFinite)
        .filter((id) => id > 0);

    return ids.length > 0 ? ids : [1249];
};

const sorted = (ids: number[]) => ids.slice().sort((a, b) => a - b);

const sameTeamSet = (left: number[], right: number[]) => {
    const a = sorted(left);
    const b = sorted(right);
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
};

interface Candidate {
    playerId: number;
    goalie: boolean;
    played: number;
    average: number;
    age: number | null;
}

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const diffTuple = (
    teamAIds: number[],
    teamBIds: number[],
    byPlayerId: Map<number, Candidate>,
    unknownAgeValue: number,
) => {
    const read = (playerId: number) => {
        const candidate = byPlayerId.get(playerId);
        if (!candidate) {
            throw new Error(`Missing candidate for player ${playerId}`);
        }
        return candidate;
    };
    const teamA = teamAIds.map(read);
    const teamB = teamBIds.map(read);

    const diffGoalies = sum(teamA.map((player) => player.goalie ? 1 : 0)) - sum(teamB.map((player) => player.goalie ? 1 : 0));
    const diffAverage = sum(teamA.map((player) => player.average)) - sum(teamB.map((player) => player.average));
    const diffUnknownAge = sum(teamA.map((player) => player.age === null ? 1 : 0)) - sum(teamB.map((player) => player.age === null ? 1 : 0));
    const diffAge = sum(teamA.map((player) => player.age ?? unknownAgeValue)) - sum(teamB.map((player) => player.age ?? unknownAgeValue));

    return [
        Math.abs(diffGoalies),
        Math.abs(diffAverage),
        Math.abs(diffUnknownAge),
        Math.abs(diffAge),
    ];
};

const compareTuple = (left: number[], right: number[]) => {
    const maxLength = Math.max(left.length, right.length);
    for (let index = 0; index < maxLength; index++) {
        const l = left[index] ?? 0;
        const r = right[index] ?? 0;
        if (Math.abs(l - r) <= 1e-9) continue;
        return l < r ? -1 : 1;
    }
    return 0;
};

const uniqueSplits = (playerIdsInOrder: number[]) => {
    if (playerIdsInOrder.length % 2 !== 0 || playerIdsInOrder.length < 2) return [] as { teamA: number[]; teamB: number[]; }[];

    const teamSize = playerIdsInOrder.length / 2;
    const first = playerIdsInOrder[0];
    const remaining = playerIdsInOrder.slice(1);
    const result: { teamA: number[]; teamB: number[]; }[] = [];

    const walk = (start: number, needed: number, prefix: number[]) => {
        if (needed === 0) {
            const teamA = [first, ...prefix];
            const teamASet = new Set(teamA);
            const teamB = playerIdsInOrder.filter((playerId) => !teamASet.has(playerId));
            result.push({ teamA, teamB });
            return;
        }

        for (let index = start; index <= remaining.length - needed; index++) {
            walk(index + 1, needed - 1, [...prefix, remaining[index]]);
        }
    };

    walk(0, teamSize - 1, []);
    return result;
};

const resolveSelectedRows = (
    selectedPlayerIds: number[],
    adminRows: OutcomePlayerType[],
): OutcomePlayerType[] => selectedPlayerIds.map((playerId) => {
    const row = adminRows.find((outcome) => outcome.playerId === playerId);
    if (!row) throw new Error(`Selected player ${playerId} is missing from admin rows.`);
    return row;
});

const buildCandidates = async ({
    gameDayId,
    gameYear,
    history,
    selectedPlayerIds,
    adminRows,
}: {
    gameDayId: number;
    gameYear: number;
    history: number;
    selectedPlayerIds: number[];
    adminRows: OutcomePlayerType[];
}): Promise<Candidate[]> => {
    const selectedRows = resolveSelectedRows(selectedPlayerIds, adminRows);

    const candidates = await Promise.all(selectedRows.map(async (row) => {
        const totalPlayed = await outcomeService.getPlayerGamesPlayedBeforeGameDay(row.playerId, gameDayId);
        const played = Math.min(10, totalPlayed ?? 0);
        const average = await outcomeService.getRecentAverage(gameDayId, row.playerId, history);
        const born = row.player.born ?? null;
        const age = (born !== null && born < 1995) ? gameYear - born : null;
        return {
            playerId: row.playerId,
            goalie: row.goalie === true,
            played,
            average,
            age,
        } satisfies Candidate;
    }));

    return candidates;
};

const buildCandidatesUsingPlayedAllTime = async ({
    gameDayId,
    gameYear,
    history,
    selectedPlayerIds,
    adminRows,
}: {
    gameDayId: number;
    gameYear: number;
    history: number;
    selectedPlayerIds: number[];
    adminRows: OutcomePlayerType[];
}): Promise<Candidate[]> => {
    const selectedRows = resolveSelectedRows(selectedPlayerIds, adminRows);

    const candidates = await Promise.all(selectedRows.map(async (row) => {
        const played = Math.min(10, await outcomeService.getPlayerGamesPlayed(row.playerId));
        const average = await outcomeService.getRecentAverage(gameDayId, row.playerId, history);
        const born = row.player.born ?? null;
        const age = (born !== null && born < 1995) ? gameYear - born : null;
        return {
            playerId: row.playerId,
            goalie: row.goalie === true,
            played,
            average,
            age,
        } satisfies Candidate;
    }));

    return candidates;
};

describeIntegration('SubmitPicker parity against historical game outcomes', () => {
    for (const gameDayId of parseGameIds()) {
        it(`matches stored teams for game ${gameDayId}`, async () => {
            const gameDay = await gameDayService.get(gameDayId);
            expect(gameDay).not.toBeNull();
            if (!gameDay) return;

            const allOutcomes = await outcomeService.getByGameDay(gameDayId);
            const historicallyPicked = allOutcomes.filter((row) => row.team !== null);
            expect(historicallyPicked.length).toBeGreaterThan(1);

            const selectedInput: SubmitPickerInput = historicallyPicked.map((row) => ({ playerId: row.playerId }));
            const writePayloads: { gameDayId: number; playerId: number; team: 'A' | 'B' | null; }[] = [];

            await SubmitPickerCore(selectedInput, {
                gameDayService: {
                    getCurrent: () => Promise.resolve(gameDay),
                },
                outcomeService: {
                    getAdminByGameDay: (id: number) => outcomeService.getAdminByGameDay(id),
                    getPlayerGamesPlayedBeforeGameDay: (playerId: number, id: number) =>
                        outcomeService.getPlayerGamesPlayedBeforeGameDay(playerId, id),
                    getRecentAverage: (id: number, playerId: number, history: number) => outcomeService.getRecentAverage(id, playerId, history),
                    upsert: (rawData: unknown) => {
                        const data = rawData as { gameDayId: number; playerId: number; team: 'A' | 'B' | null; };
                        writePayloads.push(data);
                        return Promise.resolve(null);
                    },
                },
                sendEmailToAllActivePlayers: () => Promise.resolve({ recipientCount: 0 }),
                getPublicBaseUrl: () => 'https://www.toastboy.co.uk',
            });

            const actualTeamA = historicallyPicked
                .filter((row) => row.team === 'A')
                .map((row) => row.playerId);
            const actualTeamB = historicallyPicked
                .filter((row) => row.team === 'B')
                .map((row) => row.playerId);

            const predictedAssignments = new Map<number, 'A' | 'B'>();
            for (const payload of writePayloads) {
                if (payload.gameDayId !== gameDayId) continue;
                if (payload.team === 'A' || payload.team === 'B') {
                    predictedAssignments.set(payload.playerId, payload.team);
                }
            }

            const predictedTeamA = Array.from(predictedAssignments.entries())
                .filter(([, team]) => team === 'A')
                .map(([playerId]) => playerId);
            const predictedTeamB = Array.from(predictedAssignments.entries())
                .filter(([, team]) => team === 'B')
                .map(([playerId]) => playerId);

            const sameDirect = sameTeamSet(predictedTeamA, actualTeamA) && sameTeamSet(predictedTeamB, actualTeamB);
            const sameSwapped = sameTeamSet(predictedTeamA, actualTeamB) && sameTeamSet(predictedTeamB, actualTeamA);

            if (!sameDirect && !sameSwapped) {
                const missedFromA = actualTeamA.filter((playerId) => !predictedTeamA.includes(playerId) && !predictedTeamB.includes(playerId));
                const missedFromB = actualTeamB.filter((playerId) => !predictedTeamA.includes(playerId) && !predictedTeamB.includes(playerId));
                const selectedPlayerIdsInOrder = selectedInput.map((item) => item.playerId);
                const adminRows = await outcomeService.getAdminByGameDay(gameDayId);
                const history = gameDay.pickerGamesHistory ?? 10;
                const candidates = await buildCandidates({
                    gameDayId,
                    gameYear: gameDay.year,
                    history,
                    selectedPlayerIds: selectedPlayerIdsInOrder,
                    adminRows,
                });
                const byPlayerId = new Map(candidates.map((candidate) => [candidate.playerId, candidate]));
                const knownAges = candidates
                    .map((candidate) => candidate.age)
                    .filter((age): age is number => age !== null);
                const unknownAgeValue = knownAges.length > 0 ? sum(knownAges) / knownAges.length : 0;

                const actualTuple = diffTuple(actualTeamA, actualTeamB, byPlayerId, unknownAgeValue);
                const predictedTuple = diffTuple(predictedTeamA, predictedTeamB, byPlayerId, unknownAgeValue);
                const canRankByExhaustiveSearch = selectedPlayerIdsInOrder.length % 2 === 0;
                const allSplits = canRankByExhaustiveSearch ?
                    uniqueSplits(selectedPlayerIdsInOrder).map((split) => ({
                        ...split,
                        tuple: diffTuple(split.teamA, split.teamB, byPlayerId, unknownAgeValue),
                    })) :
                    [];
                const sortedSplits = allSplits
                    .slice()
                    .sort((left, right) => compareTuple(left.tuple, right.tuple));
                const bestTuple = sortedSplits[0]?.tuple ?? null;
                const splitsAtBestTuple = bestTuple ? sortedSplits.filter((split) => compareTuple(split.tuple, bestTuple) === 0) : [];
                const betterThanActual = canRankByExhaustiveSearch ?
                    sortedSplits.filter((split) => compareTuple(split.tuple, actualTuple) < 0).length :
                    null;
                const equalToActual = canRankByExhaustiveSearch ?
                    sortedSplits.filter((split) => compareTuple(split.tuple, actualTuple) === 0).length :
                    null;

                const candidatesPlayedAllTime = await buildCandidatesUsingPlayedAllTime({
                    gameDayId,
                    gameYear: gameDay.year,
                    history,
                    selectedPlayerIds: selectedPlayerIdsInOrder,
                    adminRows,
                });
                const byPlayerIdPlayedAllTime = new Map(candidatesPlayedAllTime.map((candidate) => [candidate.playerId, candidate]));
                const knownAgesPlayedAllTime = candidatesPlayedAllTime
                    .map((candidate) => candidate.age)
                    .filter((age): age is number => age !== null);
                const unknownAgeValuePlayedAllTime = knownAgesPlayedAllTime.length > 0 ?
                    sum(knownAgesPlayedAllTime) / knownAgesPlayedAllTime.length :
                    0;
                const actualTuplePlayedAllTime = diffTuple(actualTeamA, actualTeamB, byPlayerIdPlayedAllTime, unknownAgeValuePlayedAllTime);
                const predictedTuplePlayedAllTime = diffTuple(predictedTeamA, predictedTeamB, byPlayerIdPlayedAllTime, unknownAgeValuePlayedAllTime);
                const allSplitsPlayedAllTime = canRankByExhaustiveSearch ?
                    uniqueSplits(selectedPlayerIdsInOrder).map((split) => ({
                        ...split,
                        tuple: diffTuple(split.teamA, split.teamB, byPlayerIdPlayedAllTime, unknownAgeValuePlayedAllTime),
                    })) :
                    [];
                const sortedSplitsPlayedAllTime = allSplitsPlayedAllTime
                    .slice()
                    .sort((left, right) => compareTuple(left.tuple, right.tuple));
                const bestTuplePlayedAllTime = sortedSplitsPlayedAllTime[0]?.tuple ?? null;
                const betterThanActualPlayedAllTime = canRankByExhaustiveSearch ?
                    sortedSplitsPlayedAllTime
                        .filter((split) => compareTuple(split.tuple, actualTuplePlayedAllTime) < 0).length :
                    null;

                console.error(JSON.stringify({
                    gameDayId,
                    actual: {
                        teamA: sorted(actualTeamA),
                        teamB: sorted(actualTeamB),
                    },
                    predicted: {
                        teamA: sorted(predictedTeamA),
                        teamB: sorted(predictedTeamB),
                    },
                    unmatchedPlayers: {
                        actualOnlyTeamA: sorted(missedFromA),
                        actualOnlyTeamB: sorted(missedFromB),
                    },
                    diagnostics: {
                        gameDayPickerGamesHistory: gameDay.pickerGamesHistory,
                        historyUsedByPickerCode: history,
                        inputOrder: selectedPlayerIdsInOrder,
                        actualTuple,
                        predictedTuple,
                        bestTuple,
                        canRankByExhaustiveSearch,
                        betterThanActual,
                        equalToActual,
                        splitsAtBestTupleCount: splitsAtBestTuple.length,
                        candidateSnapshot: candidates
                            .slice()
                            .sort((left, right) => left.playerId - right.playerId),
                        firstBestSplits: splitsAtBestTuple.slice(0, 5).map((split) => ({
                            teamA: sorted(split.teamA),
                            teamB: sorted(split.teamB),
                            tuple: split.tuple,
                        })),
                        alternatePlayedAllTime: {
                            actualTuple: actualTuplePlayedAllTime,
                            predictedTuple: predictedTuplePlayedAllTime,
                            bestTuple: bestTuplePlayedAllTime,
                            betterThanActual: betterThanActualPlayedAllTime,
                        },
                    },
                }, null, 2));
            }

            expect(sameDirect || sameSwapped).toBe(true);
        });
    }
});

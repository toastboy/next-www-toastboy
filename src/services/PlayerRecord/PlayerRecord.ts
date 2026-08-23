import prisma from 'prisma/prisma';
import type { GameDayStatus, TableName } from 'prisma/zod/schemas';
import { PlayerRecordWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import type { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { config } from '@/lib/config';
import { InternalError } from '@/lib/errors';
import { getPlayerPoints } from '@/lib/gameResult';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import { rankMap, scoreFieldMap } from '@/lib/tables';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { PlayerRecordDataType } from '@/types';
import {
    PlayerRecordCreateOneStrictSchema,
    PlayerRecordUpsertOneStrictSchema,
    type PlayerRecordWriteInput,
    PlayerRecordWriteInputSchema,
} from '@/types/PlayerRecordStrictSchema';

class PlayerRecordService {
    /**
     * Retrieves a PlayerRecord for the given Player ID, year and PlayerRecord ID.
     * @param playerId - The ID of the Player.
     * @param year - The year of the GameDay, or zero for all years.
     * @param gameDayId - The ID of the GameDay.
     * @returns A promise that resolves to the PlayerRecord if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(
        playerId: number,
        year: number,
        gameDayId: number,
    ): Promise<PlayerRecordType | null> {
        const where = PlayerRecordWhereUniqueInputObjectSchema.parse({
            playerId_year_gameDayId: { playerId, year, gameDayId },
        });

        return prisma.playerRecord.findUnique({ where });
    }

    /**
     * Retrieves all player records from the database.
     * @returns {Promise<PlayerRecordType[]>} A promise that resolves to an
     * array of all player records.
     * @throws {Error} Throws an error if the database query fails.
     */
    async getAll(): Promise<PlayerRecordType[]> {
        return prisma.playerRecord.findMany({});
    }

    /**
     * Retrieves the progress of the player by comparing the last recorded game
     * day with the most recently played game day.
     * @returns A promise that resolves to a tuple containing the last recorded
     * game day ID and the total/most recent game day ID, or null if no recently
     * played game data is available.
     * @throws Logs and rethrows any errors that occur during the database query
     * or service call.
     */
    async getProgress(): Promise<[number, number] | null> {
        const lastRecord = await prisma.playerRecord.findFirst({
            orderBy: {
                gameDayId: 'desc',
            },
        });

        const total = await outcomeService.getLastPlayed();
        if (!total) return null;
        const lastGameDay = lastRecord ? lastRecord.gameDayId : 0;

        return [lastGameDay, total.gameDayId];
    }

    /**
     * Retrieves a list of distinct years from player records, filtered and
     * sorted according to the provided options.
     *
     * This method optimizes the retrieval of years by leveraging season enders
     * and filtering records accordingly. It can return only completed seasons
     * or all seasons up to the current date, and allows sorting by most recent
     * first.
     *
     * @param options - The options for filtering and sorting the years.
     * @param options.completed - If `true`, only includes years for completed
     * seasons (default: `false`).
     * @param options.mostRecentFirst - If `true`, sorts years in descending
     * order with zero values at the start; otherwise, sorts in ascending order
     * with zero values at the end (default: `false`).
     * @returns A promise that resolves to an array of distinct years, filtered
     * and sorted as specified.
     * @throws Will throw an error if the retrieval or processing fails.
     */
    async getAllYears({
        completed = false,
        mostRecentFirst = false,
    }): Promise<number[]> {
        let lastGamesEachYear = await prisma.gameDay.groupBy({
            by: ['year'],
            where: {
                status: { not: 'NoGame' },
            },
            _max: {
                id: true,
            },
        });

        if (completed) {
            const yearsWithUnplayedGames = await prisma.gameDay.groupBy({
                by: ['year'],
                where: {
                    status: { not: 'NoGame' },
                    date: { gt: new Date() },
                },
            });

            const yearsToRemove = new Set(
                yearsWithUnplayedGames.map((y) => y.year),
            );
            lastGamesEachYear = lastGamesEachYear.filter(
                (r) => !yearsToRemove.has(r.year),
            );
        }

        const years = lastGamesEachYear.map((r) => r.year);

        return mostRecentFirst
            ? [0, ...years.sort((a, b) => b - a)]
            : [...years.sort((a, b) => a - b), 0];
    }

    /**
     * Retrieves playerRecords by GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @param year - The year to filter by (optional) - zero means all-time.
     * @returns A promise that resolves to an array of PlayerRecords (possibly empty).
     * @throws An error if there is a failure.
     */
    async getByGameDay(
        gameDayId: number,
        year?: number,
    ): Promise<PlayerRecordType[]> {
        return prisma.playerRecord.findMany({
            where: {
                gameDayId: gameDayId,
                ...(year != undefined ? { year: year } : {}),
            },
        });
    }

    /**
     * Retrieves playerRecords by player ID.
     * @param playerId - The ID of the player.
     * @param year - The year to filter by (optional) - zero means all-time.
     * @returns A promise that resolves to an array of PlayerRecords (possibly empty).
     * @throws An error if there is a failure.
     */
    async getByPlayer(
        playerId: number,
        year?: number,
    ): Promise<PlayerRecordType[]> {
        return prisma.playerRecord.findMany({
            where: {
                playerId: playerId,
                ...(year !== undefined ? { year } : {}),
            },
        });
    }

    /**
     * Retrieves a player record for a specific year and player.
     * @param year - The year of the player record.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to the player record for the specified
     * year and player, or null if not found.
     * @throws If there was an error fetching the player record.
     */
    async getForYearByPlayer(
        year: number,
        playerId: number,
    ): Promise<PlayerRecordType | null> {
        const result = await prisma.playerRecord.findFirst({
            where: {
                year: year,
                playerId: playerId,
            },
            orderBy: {
                gameDayId: 'desc',
            },
        });

        if (result === null) {
            const player = await prisma.player.findUnique({
                where: {
                    id: playerId,
                },
            });

            if (player === null) return null;

            return {
                id: 0,
                playerId: playerId,
                year: year,
                gamesPlayed: 0,
                gameDayId: 0,
                responses: 0,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                points: null,
                scorePoints: 0,
                scoreAverages: 0,
                scoreStalwart: 0,
                scorePub: 0,
                rankPoints: null,
                rankAverages: null,
                rankAveragesUnqualified: null,
                rankStalwart: null,
                rankSpeedy: null,
                rankSpeedyUnqualified: null,
                rankPub: null,
                scoreSpeedy: 0,
            };
        } else {
            return result;
        }
    }

    /**
     * Retrieves the list of player records who achieved first place in a given table and year.
     *
     * This method queries the database for player records where the specified rank column equals 1,
     * optionally filtered by year and/or player ID. It further filters the results to include only
     * those records whose game day IDs are considered "season enders" as determined by the gameDayService.
     *
     * @param table - The name of the table to query for winners (used to determine the rank column).
     * @param year - (Optional) The year to filter the records by. If not provided, all years greater than 0 are considered.
     * @param player - (Optional) The player ID to filter the records by. If not provided, all players are considered.
     * @returns A promise that resolves to an array of player records who achieved first place on season-ending game days.
     * @throws Will log and rethrow any errors encountered during the database query or filtering process.
     */
    async getWinners(
        table: TableName,
        year?: number,
        player?: number,
    ): Promise<PlayerRecordDataType[]> {
        const rank = rankMap[table][0];
        const seasonEnders = await gameDayService.getSeasonEnders();
        const firstPlaceRecords = await prisma.playerRecord.findMany({
            where: {
                ...(year ? { year } : { year: { gt: 0 } }),
                ...(player ? { playerId: player } : {}),
                [rank]: 1,
            },
            orderBy: {
                year: 'desc',
            },
            include: {
                player: true,
            },
        });

        return firstPlaceRecords.filter((record) =>
            seasonEnders.includes(record.gameDayId),
        );
    }

    /**
     * Retrieves player records from the specified table for a given year.
     * @param table - The table to retrieve player records from.
     * @param year - The year for which to retrieve player records.
     * @param qualified - Flag indicating whether to exclude unqualified rows -
     * e.g. players who haven't played enough games for the averages table
     * (optional). If this is not set, all players are included.
     * @param take - The maximum number of player records to retrieve
     * (optional).
     * @returns A promise that resolves to an array of PlayerRecord objects.
     * @throws If there is an error while fetching the player records.
     */
    async getTable(
        table: TableName,
        year: number,
        qualified?: boolean,
        take?: number,
    ): Promise<PlayerRecordDataType[]> {
        const tableRecord = await prisma.playerRecord.findFirst({
            where: {
                year: year,
                [scoreFieldMap[table]]: {
                    not: null,
                },
            },
            orderBy: {
                gameDayId: 'desc',
            },
            select: {
                gameDayId: true,
            },
        });
        if (!tableRecord) return [];

        const rank = rankMap[table][qualified === false ? 1 : 0];
        if (!rank) return [];

        return prisma.playerRecord.findMany({
            where: {
                gameDayId: tableRecord.gameDayId,
                year: year,
                [rank]: {
                    not: null,
                },
            },
            orderBy: {
                [rank]: 'asc',
            },
            take: take,
            include: {
                player: true,
            },
        });
    }

    /**
     * Creates a player record from validated write input.
     * @param data - Player-record write payload.
     * @returns The created player-record row.
     */
    async create(data: PlayerRecordWriteInput): Promise<PlayerRecordType> {
        const writeData = PlayerRecordWriteInputSchema.parse(data);
        const args = PlayerRecordCreateOneStrictSchema.parse({
            data: writeData,
        });
        return prisma.playerRecord.create(args);
    }

    /**
     * Upserts a player record by `(playerId, year, gameDayId)`.
     * @param data - Player-record write payload.
     * @returns The created or updated player-record row.
     */
    async upsert(data: PlayerRecordWriteInput): Promise<PlayerRecordType> {
        const writeData = PlayerRecordWriteInputSchema.parse(data);
        const args = PlayerRecordUpsertOneStrictSchema.parse({
            where: {
                playerId_year_gameDayId: {
                    playerId: writeData.playerId,
                    year: writeData.year,
                    gameDayId: writeData.gameDayId,
                },
            },
            create: writeData,
            update: writeData,
        });
        return prisma.playerRecord.upsert(args);
    }

    /**
     * Upserts all PlayerRecords for a single GameDay.
     * @param gameDayId The ID of the GameDay - if undefined then all GameDays
     * are processed.
     * @returns A promise that resolves to an array of all the upserted
     * PlayerRecords, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsertForGameDay(gameDayId?: number): Promise<PlayerRecordType[]> {
        const today = new Date();
        const allTimeOutcomes = await outcomeService.getAllForYear(0);

        const allGameDays = await gameDayService.getAll();
        const statusById = new Map(allGameDays.map((gd) => [gd.id, gd.status]));

        let gameDays = allGameDays;
        if (gameDayId) {
            gameDays = gameDays.filter((g) => g.id === gameDayId);
        }

        const years = gameDays.map((gd) => gd.date.getFullYear());
        const distinctYears = Array.from(new Set(years));

        const playerRecords: PlayerRecordType[] = [];
        const allTimePlayerRecords: Record<
            number,
            Partial<PlayerRecordType>
        > = {};
        for (const year of distinctYears) {
            const yearPlayerRecords: Record<
                number,
                Partial<PlayerRecordType>
            > = {};
            const yearOutcomes = await outcomeService.getAllForYear(year);

            for (const gameDay of gameDays) {
                if (
                    gameDay.date.getFullYear() !== year ||
                    gameDay.date > today
                ) {
                    continue;
                }

                const gameDayOutcomes = await outcomeService.getByGameDay(
                    gameDay.id,
                );

                await calculateYearPlayerRecords(
                    year,
                    yearOutcomes,
                    yearPlayerRecords,
                    gameDay,
                    gameDayOutcomes,
                    playerRecords,
                    statusById,
                );
                await calculateYearPlayerRecords(
                    0,
                    allTimeOutcomes,
                    allTimePlayerRecords,
                    gameDay,
                    gameDayOutcomes,
                    playerRecords,
                    statusById,
                );
            }
        }

        return playerRecords;
    }

    /**
     * Rebuilds PlayerRecords from the provided game day onward.
     *
     * Bootstraps the running per-year and all-time player-record state from
     * the most-recent database snapshot per player before `gameDayId`, then
     * replays all game days from that point in chronological order. This
     * ensures rankings at each rebuilt game day are computed across all known
     * players — not only those who happened to play on the specific day being
     * processed.
     *
     * Future game days are excluded because records/standings should only
     * reflect completed time periods. Fixtures in the future may already have
     * response data, but those should not affect rankings yet.
     *
     * @param gameDayId - The game day from which records should be rebuilt.
     * @returns A promise that resolves to the upserted PlayerRecords.
     * @throws Any error thrown by underlying services or database operations if
     * rebuilding PlayerRecords fails.
     */
    async upsertFromGameDay(gameDayId: number): Promise<PlayerRecordType[]> {
        const fromGameDay = await gameDayService.get(gameDayId);
        if (!fromGameDay) return [];

        const today = new Date();
        const allGameDays = await gameDayService.getAll();
        const statusById = new Map(allGameDays.map((gd) => [gd.id, gd.status]));
        const gameDays = allGameDays
            .filter((gameDay) => gameDay.date >= fromGameDay.date)
            // Keep future fixtures out of PlayerRecord calculations until
            // their date has passed.
            .filter((gameDay) => gameDay.date <= today);

        if (gameDays.length === 0) {
            return [];
        }

        const allTimeOutcomes = await outcomeService.getAllForYear(0);
        const allTimePlayerRecords = await loadLatestPlayerRecordsBefore(
            0,
            gameDayId,
        );

        const years = [...new Set(gameDays.map((gd) => gd.date.getFullYear()))];
        const playerRecords: PlayerRecordType[] = [];

        for (const year of years) {
            const yearPlayerRecords = await loadLatestPlayerRecordsBefore(
                year,
                gameDayId,
            );

            const yearOutcomes = await outcomeService.getAllForYear(year);

            for (const gameDay of gameDays) {
                if (
                    gameDay.date.getFullYear() !== year ||
                    gameDay.date > today
                ) {
                    continue;
                }

                const gameDayOutcomes = await outcomeService.getByGameDay(
                    gameDay.id,
                );

                await calculateYearPlayerRecords(
                    year,
                    yearOutcomes,
                    yearPlayerRecords,
                    gameDay,
                    gameDayOutcomes,
                    playerRecords,
                    statusById,
                );
                await calculateYearPlayerRecords(
                    0,
                    allTimeOutcomes,
                    allTimePlayerRecords,
                    gameDay,
                    gameDayOutcomes,
                    playerRecords,
                    statusById,
                );
            }
        }

        return playerRecords;
    }

    /**
     * Deletes a PlayerRecord.
     * @param playerId - The ID of the Player.
     * @param year - The year of the GameDay.
     * @param gameDayId - The ID of the GameDay.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If key validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(
        playerId: number,
        year: number,
        gameDayId: number,
    ): Promise<void> {
        try {
            const where = PlayerRecordWhereUniqueInputObjectSchema.parse({
                playerId_year_gameDayId: { playerId, year, gameDayId },
            });

            await prisma.playerRecord.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw error;
        }
    }

    /**
     * Deletes all playerRecords.
     * @returns A promise that resolves when all playerRecords are deleted.
     */
    async deleteAll(): Promise<void> {
        await prisma.playerRecord.deleteMany();
    }
}

const playerRecordService = new PlayerRecordService();
export default playerRecordService;

/**
 * Returns a player-records map seeded from the most-recent DB row per player
 * for the given year before `beforeGameDayId`. Only writable fields are kept
 * (i.e. `id` is stripped via `PlayerRecordWriteInputSchema`) so the map is
 * safe to pass directly to `calculateYearPlayerRecords`.
 */
async function loadLatestPlayerRecordsBefore(
    year: number,
    beforeGameDayId: number,
): Promise<Record<number, Partial<PlayerRecordType>>> {
    const map: Record<number, Partial<PlayerRecordType>> = {};

    const groups = await prisma.playerRecord.groupBy({
        by: ['playerId'],
        where: { year, gameDayId: { lt: beforeGameDayId } },
        _max: { gameDayId: true },
    });

    const conditions = groups
        .filter((g) => g._max.gameDayId !== null)
        .map((g) => ({ playerId: g.playerId, gameDayId: g._max.gameDayId! }));

    if (conditions.length > 0) {
        const records = await prisma.playerRecord.findMany({
            where: { year, OR: conditions },
        });
        for (const record of records) {
            map[record.playerId] = PlayerRecordWriteInputSchema.parse(record);
        }
    }

    return map;
}

/**
 * Builds a score-to-rank lookup from an array of scores already sorted into
 * rank order (best first). Tied scores share the rank of their first
 * occurrence, matching `Array.prototype.indexOf` semantics but computed once
 * in O(n) rather than on every O(n) lookup.
 * @param sortedScores - Scores sorted into rank order (best first).
 * @returns A map from score to its 1-based rank.
 */
function rankByScore(sortedScores: number[]): Map<number, number> {
    const ranks = new Map<number, number>();
    sortedScores.forEach((score, index) => {
        if (!ranks.has(score)) {
            ranks.set(score, index + 1);
        }
    });
    return ranks;
}

/**
 * Looks up a score's precomputed rank. The caller must pass a `ranks` map
 * built by `rankByScore` from the same array — and under the same
 * qualification filter — the score was drawn from, so the score is always
 * present.
 * @param ranks - A score-to-rank map built by `rankByScore` from the same
 * array the score was drawn from.
 * @param score - The score to look up.
 * @returns The score's 1-based rank.
 */
function getRank(ranks: Map<number, number>, score: number): number {
    return ranks.get(score)!;
}

/**
 * Calculates the player records for a specific year and game day.
 *
 * @param year - The year for which to calculate the player records.
 * @param yearOutcomes - The outcomes for the entire year.
 * @param yearPlayerRecords - The player records for the entire year.
 * @param gameDay - The game day for which to calculate the player records.
 * @param gameDayOutcomes - The outcomes for the specific game day.
 * @param playerRecords - The existing player records.
 * @param statusById - A lookup from game day ID to its status, covering
 * every game day referenced by `yearOutcomes`, used to derive each outcome's
 * points.
 */
async function calculateYearPlayerRecords(
    year: number,
    yearOutcomes: OutcomeType[],
    yearPlayerRecords: Record<number, Partial<PlayerRecordType>>,
    gameDay: GameDayType,
    gameDayOutcomes: OutcomeType[],
    playerRecords: PlayerRecordType[],
    statusById: Map<number, GameDayStatus>,
) {
    // Start with a list of PlayerRecords, including those for anyone with any
    // standing this year. For each one with an outcome this game day, add or
    // update the PlayerRecord as appropriate

    for (const outcome of gameDayOutcomes) {
        yearPlayerRecords[outcome.playerId] = {
            ...yearPlayerRecords[outcome.playerId],
            ...calculatePlayerRecord(
                year,
                gameDay,
                yearOutcomes,
                outcome,
                statusById,
            ),
        };
    }

    // Update the scores that vary with game day, regardless of whether the
    // player played this game (e.g. stalwart score)

    const gamesPlayed = await gameDayService.getGamesPlayed(year, gameDay.id);

    for (const recordData of Object.values(yearPlayerRecords)) {
        recordData.gameDayId = gameDay.id;
        recordData.gamesPlayed = gamesPlayed;
        if (recordData.played && gamesPlayed > 0) {
            recordData.scoreStalwart = Math.round(
                (100.0 * recordData.played) / gamesPlayed,
            );
        }
    }

    // Calculate the ranks for the set of PlayerRecords
    const pointsArray = Object.values(yearPlayerRecords)
        .map((r) => r.scorePoints)
        .filter((p): p is number => p != null);
    pointsArray.sort((a, b) => b - a);

    const averagesArray = Object.values(yearPlayerRecords)
        .map((r) =>
            r.played &&
            r.played > 0 &&
            r.played >= config.minGamesForAveragesTable
                ? r.scoreAverages
                : null,
        )
        .filter((a): a is number => a != null);
    averagesArray.sort((a, b) => b - a);

    const averagesArrayUnqualified = Object.values(yearPlayerRecords)
        .map((r) =>
            r.played &&
            r.played > 0 &&
            r.played < config.minGamesForAveragesTable
                ? r.scoreAverages
                : null,
        )
        .filter((a): a is number => a != null);
    averagesArrayUnqualified.sort((a, b) => b - a);

    const stalwartArray = Object.values(yearPlayerRecords)
        .map((r) => r.scoreStalwart)
        .filter((s): s is number => s != null);
    stalwartArray.sort((a, b) => b - a);

    const speedyArray = Object.values(yearPlayerRecords)
        .map((r) =>
            r.responses && r.responses >= config.minRepliesForSpeedyTable
                ? r.scoreSpeedy
                : null,
        )
        .filter((s): s is number => s != null);
    speedyArray.sort((a, b) => a - b);

    const speedyArrayUnqualified = Object.values(yearPlayerRecords)
        .map((r) =>
            r.responses && r.responses < config.minRepliesForSpeedyTable
                ? r.scoreSpeedy
                : null,
        )
        .filter((s): s is number => s != null);
    speedyArrayUnqualified.sort((a, b) => a - b);

    const pubArray = Object.values(yearPlayerRecords)
        .map((r) => r.scorePub)
        .filter((p): p is number => p != null);
    pubArray.sort((a, b) => b - a);

    const pointsRanks = rankByScore(pointsArray);
    const averagesRanks = rankByScore(averagesArray);
    const averagesUnqualifiedRanks = rankByScore(averagesArrayUnqualified);
    const stalwartRanks = rankByScore(stalwartArray);
    const speedyRanks = rankByScore(speedyArray);
    const speedyUnqualifiedRanks = rankByScore(speedyArrayUnqualified);
    const pubRanks = rankByScore(pubArray);

    for (const recordData of Object.values(yearPlayerRecords)) {
        if (recordData.scorePoints != null) {
            recordData.rankPoints = getRank(
                pointsRanks,
                recordData.scorePoints,
            );
        }
        if (recordData.scoreAverages != null) {
            if (
                recordData.played &&
                recordData.played >= config.minGamesForAveragesTable
            ) {
                recordData.rankAverages = getRank(
                    averagesRanks,
                    recordData.scoreAverages,
                );
                recordData.rankAveragesUnqualified = null;
            } else {
                recordData.rankAveragesUnqualified = getRank(
                    averagesUnqualifiedRanks,
                    recordData.scoreAverages,
                );
                recordData.rankAverages = null;
            }
        }
        if (recordData.scoreStalwart != null) {
            recordData.rankStalwart = getRank(
                stalwartRanks,
                recordData.scoreStalwart,
            );
        }
        if (recordData.scoreSpeedy != null) {
            if (
                recordData.responses &&
                recordData.responses >= config.minRepliesForSpeedyTable
            ) {
                recordData.rankSpeedy = getRank(
                    speedyRanks,
                    recordData.scoreSpeedy,
                );
                recordData.rankSpeedyUnqualified = null;
            } else {
                recordData.rankSpeedyUnqualified = getRank(
                    speedyUnqualifiedRanks,
                    recordData.scoreSpeedy,
                );
                recordData.rankSpeedy = null;
            }
        }
        if (recordData.scorePub != null) {
            recordData.rankPub = getRank(pubRanks, recordData.scorePub);
        }
    }

    // Upsert the PlayerRecords and add them to the overall list

    for (const recordData of Object.values(yearPlayerRecords)) {
        const playerRecord = await playerRecordService.upsert(
            recordData as PlayerRecordWriteInput,
        );
        playerRecords.push(playerRecord);
    }
}

/**
 * Calculates the player record for a specific year and game day based on the
 * provided outcomes.
 * @param year - The year of the player record.
 * @param gameDay - The game day for which the player record is calculated.
 * @param yearOutcomes - The outcomes for the entire year.
 * @param outcome - The outcome for the specific game day.
 * @param statusById - A lookup from game day ID to its status, covering
 * every game day referenced by `yearOutcomes`, used to derive each outcome's
 * points.
 * @returns A promise that resolves to a partial player record object.
 */
function calculatePlayerRecord(
    year: number,
    gameDay: GameDayType,
    yearOutcomes: OutcomeType[],
    outcome: OutcomeType,
    statusById: Map<number, GameDayStatus>,
): Partial<PlayerRecordType> {
    const pointsOf = (o: OutcomeType) => {
        const status = statusById.get(o.gameDayId);
        if (status === undefined) {
            throw new InternalError(
                `GameDay ${o.gameDayId} is missing from the status map while computing points for player ${o.playerId}.`,
                { details: { gameDayId: o.gameDayId, playerId: o.playerId } },
            );
        }
        return getPlayerPoints(status, o.team ?? null);
    };

    const playerYearOutcomes = yearOutcomes
        .filter(
            (o) => o.playerId === outcome.playerId && o.gameDayId <= gameDay.id,
        )
        .map((o) => ({ outcome: o, points: pointsOf(o) }));
    const playerYearRespondedOutcomes = playerYearOutcomes.filter(
        ({ outcome: o }) => o.response != null,
    );
    const playerYearPlayedOutcomes = playerYearOutcomes.filter(
        ({ points }) => points != null,
    );
    const pub = playerYearOutcomes.reduce(
        (acc, { outcome: o }) => acc + (o.pub ?? 0),
        0,
    );
    const data: Partial<PlayerRecordType> = {
        playerId: outcome.playerId,
        year: year,
        gameDayId: gameDay.id,
        responses: playerYearRespondedOutcomes.length,
        points: pointsOf(outcome),
        ...{ scorePub: pub > 0 ? pub : null },
    };

    if (playerYearPlayedOutcomes.length > 0) {
        data.played = playerYearPlayedOutcomes.length;
        data.won = playerYearPlayedOutcomes.filter(
            ({ points }) => points == 3,
        ).length;
        data.drawn = playerYearPlayedOutcomes.filter(
            ({ points }) => points == 1,
        ).length;
        data.lost = playerYearPlayedOutcomes.filter(
            ({ points }) => points == 0,
        ).length;
    }

    if (data.played && data.played > 0) {
        const totalPoints = playerYearPlayedOutcomes.reduce(
            (acc, { points }) => acc + points!,
            0,
        );
        data.scorePoints = totalPoints;
        data.scoreAverages = totalPoints / data.played;
    }

    const responseIntervals = playerYearOutcomes
        .map(({ outcome: o }) => o.responseInterval)
        .filter((num): num is number => num != null);

    if (responseIntervals.length > 0) {
        data.scoreSpeedy =
            responseIntervals.reduce((acc, ri) => acc + ri, 0) /
            responseIntervals.length;
    }

    return data;
}

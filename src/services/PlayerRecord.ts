import 'server-only';

import debug from 'debug';
import config from 'lib/config';
import prisma from 'lib/prisma';
import { rankMap } from 'lib/utils';
import {
    PlayerRecordUncheckedCreateInputObjectZodSchema,
    PlayerRecordUncheckedUpdateInputObjectZodSchema,
    PlayerRecordWhereUniqueInputObjectSchema,
    TableName,
} from 'prisma/generated/schemas';
import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';
import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';
import { PlayerRecordSchema, PlayerRecordType } from 'prisma/generated/schemas/models/PlayerRecord.schema';
import gameDayService from 'services/GameDay';
import outcomeService from 'services/Outcome';
import z from 'zod';

import { PlayerRecordDataType } from '@/types';

/** Field definitions with extra validation */
const extendedFields = {
    playerId: z.number().int().min(1),
    year: z.number().int().min(0),
    gameDayId: z.number().int().min(1),
    responses: z.number().int().min(0).optional().nullable(),
    played: z.number().int().min(0).optional().nullable(),
    won: z.number().int().min(0).optional().nullable(),
    drawn: z.number().int().min(0).optional().nullable(),
    lost: z.number().int().min(0).optional().nullable(),
    points: z.number().int().min(0).optional().nullable(),
    averages: z.number().min(0.0).optional().nullable(),
    stalwart: z.number().int().min(0).optional().nullable(),
    pub: z.number().int().min(0).optional().nullable(),
    rankPoints: z.number().int().min(0).optional().nullable(),
    rankAverages: z.number().int().min(0).optional().nullable(),
    rankAveragesUnqualified: z.number().int().min(0).optional().nullable(),
    rankStalwart: z.number().int().min(0).optional().nullable(),
    rankSpeedy: z.number().int().min(0).optional().nullable(),
    rankSpeedyUnqualified: z.number().int().min(0).optional().nullable(),
    rankPub: z.number().int().min(0).optional().nullable(),
    speedy: z.number().min(0.0).optional().nullable(),
};

/** Schemas for enforcing strict input */
export const PlayerRecordUncheckedCreateInputObjectStrictSchema =
    PlayerRecordUncheckedCreateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const PlayerRecordUncheckedUpdateInputObjectStrictSchema =
    PlayerRecordUncheckedUpdateInputObjectZodSchema.extend({
        ...extendedFields,
    });

const log = debug('footy:api');

export class PlayerRecordService {
    /**
     * Retrieves a PlayerRecord for the given Player ID, year and PlayerRecord ID.
     * @param playerId - The ID of the Player.
     * @param year - The year of the GameDay, or zero for all years.
     * @param gameDayId - The ID of the GameDay.
     * @returns A promise that resolves to the PlayerRecord if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, year: number, gameDayId: number): Promise<PlayerRecordType | null> {
        try {
            const where = PlayerRecordWhereUniqueInputObjectSchema.parse({
                playerId_year_gameDayId: { playerId, year, gameDayId },
            });

            return prisma.playerRecord.findUnique({ where });
        } catch (error) {
            log(`Error fetching playerRecords: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all playerRecords.
     * @returns A promise that resolves to an array of playerRecords or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<PlayerRecordType[]> {
        try {
            return prisma.playerRecord.findMany({});
        } catch (error) {
            log(`Error fetching playerRecords: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the progress of creating PlayerRecords for each GameDay where a
     * game was played.
     * @returns A promise that resolves to an array containing the last recorded
     * game day ID and the last game day ID where there was a game, or null if
     * the records or last game are not available.
     */
    async getProgress(): Promise<[number, number] | null> {
        try {
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
        catch (error) {
            log(`Error fetching playerRecords: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all the years where there is at least one PlayerRecord, with zero (for all-time) at the end.
     * @returns A promise that resolves to an array of distinct years.
     * @throws An error if there is a failure.
     */
    async getAllYears(): Promise<number[]> {
        try {
            const records = await prisma.playerRecord.findMany({
                select: {
                    year: true,
                },
                orderBy: {
                    year: 'asc',
                },
            });
            // Move zero values to the end
            const years = records.map(r => r.year).sort((a, b) => {
                if (a === 0) return 1;
                if (b === 0) return -1;
                return a - b;
            });
            const distinctYears = Array.from(new Set(years));

            return Promise.resolve(distinctYears);
        } catch (error) {
            log(`Error fetching playerRecords: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves playerRecords by GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @param year - The year to filter by (optional) - zero means all-time.
     * @returns A promise that resolves to an array of PlayerRecords or null.
     * @throws An error if there is a failure.
     */
    async getByGameDay(gameDayId: number, year?: number): Promise<PlayerRecordType[]> {
        try {
            return prisma.playerRecord.findMany({
                where: {
                    gameDayId: gameDayId,
                    ...(year != undefined ? { year: year } : {}),
                },
            });
        } catch (error) {
            log(`Error fetching playerRecords by GameDay: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves playerRecords by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of playerRecords or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<PlayerRecordType[]> {
        try {
            return prisma.playerRecord.findMany({
                where: {
                    playerId: playerId,
                },
            });
        } catch (error) {
            log(`Error fetching playerRecords by player: ${String(error)}`);
            throw error;
        }
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
        try {
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
                    gameDayId: 0,
                    responses: 0,
                    played: 0,
                    won: 0,
                    drawn: 0,
                    lost: 0,
                    points: 0,
                    averages: 0,
                    stalwart: 0,
                    pub: 0,
                    rankPoints: null,
                    rankAverages: null,
                    rankAveragesUnqualified: null,
                    rankStalwart: null,
                    rankSpeedy: null,
                    rankSpeedyUnqualified: null,
                    rankPub: null,
                    speedy: 0,
                };
            }
            else {
                return result;
            }
        } catch (error) {
            log(`Error fetching playerRecord for player: ${String(error)}`);
            throw error;
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
        try {
            const rank = rankMap[table];
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

            return firstPlaceRecords.filter((record) => seasonEnders.includes(record.gameDayId));
        } catch (error) {
            log(`Error fetching playerRecords for winners: ${String(error)}`);
            throw error;
        }
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
        try {
            // Get the most recent game day for the year in question with a
            // record for the specified table

            const tableRecord = await prisma.playerRecord.findFirst({
                where: {
                    year: year,
                    [table]: {
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
            if (!tableRecord) {
                return [];
            }

            // Now generate the query to fetch the player records

            const rank = `${rankMap[table]}${qualified === false ? 'Unqualified' : ''}`;

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
        } catch (error) {
            log(`Error fetching playerRecords for table: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a new playerRecord.
     * @param data The data for the new playerRecord.
     * @returns A promise that resolves to the created playerRecord, or null if
     * an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<PlayerRecordType | null> {
        try {
            const data = PlayerRecordUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.playerRecord.create({ data });
        } catch (error) {
            log(`Error creating playerRecord: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a PlayerRecord.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted PlayerRecord, or null if
     * the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<PlayerRecordType | null> {
        try {
            const parsed = PlayerRecordSchema.pick({
                playerId: true, year: true, gameDayId: true,
            }).parse(rawData);
            const where = PlayerRecordWhereUniqueInputObjectSchema.parse({
                playerId_year_gameDayId: {
                    playerId: parsed.playerId,
                    year: parsed.year,
                    gameDayId: parsed.gameDayId,
                },
            });
            const update = PlayerRecordUncheckedUpdateInputObjectStrictSchema.parse(rawData);
            const create = PlayerRecordUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.playerRecord.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting PlayerRecord: ${String(error)}`);
            throw error;
        }
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
        try {
            const today = new Date();
            const allTimeOutcomes = await outcomeService.getAllForYear(0);

            let gameDays = await gameDayService.getAll();
            if (gameDayId) {
                gameDays = gameDays.filter(g => g.id === gameDayId);
            }

            const years = gameDays.map(gd => gd.date.getFullYear());
            const distinctYears = Array.from(new Set(years));

            const playerRecords: PlayerRecordType[] = [];
            const allTimePlayerRecords: Record<number, Partial<PlayerRecordType>> = {};
            for (const year of distinctYears) {
                const yearPlayerRecords: Record<number, Partial<PlayerRecordType>> = {};
                const yearOutcomes = await outcomeService.getAllForYear(year);

                console.log(`Processing year ${year}...`);

                for (const gameDay of gameDays) {
                    if (gameDay.date.getFullYear() !== year || gameDay.date > today) {
                        continue;
                    }

                    console.log(`  Processing game day ${gameDay.id} (${gameDay.date.toDateString()})...`);

                    const gameDayOutcomes = await outcomeService.getByGameDay(gameDay.id);

                    await calculateYearPlayerRecords(
                        year,
                        yearOutcomes,
                        yearPlayerRecords,
                        gameDay,
                        gameDayOutcomes,
                        playerRecords,
                    );
                    await calculateYearPlayerRecords(
                        0,
                        allTimeOutcomes,
                        allTimePlayerRecords,
                        gameDay,
                        gameDayOutcomes,
                        playerRecords,
                    );
                }
            }

            return Promise.resolve(playerRecords);
        } catch (error) {
            log(`Error upserting PlayerRecord: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a PlayerRecord.
     * @param playerId - The ID of the Player.
     * @param year - The year of the GameDay.
     * @param gameDayId - The ID of the GameDay.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, year: number, gameDayId: number): Promise<void> {
        try {
            const where = PlayerRecordWhereUniqueInputObjectSchema.parse({
                playerId_year_gameDayId: { playerId, year, gameDayId },
            });

            await prisma.playerRecord.delete({ where });
        } catch (error) {
            log(`Error deleting playerRecord: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all playerRecords.
     * @returns A promise that resolves when all playerRecords are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.playerRecord.deleteMany();
        } catch (error) {
            log(`Error deleting playerRecords: ${String(error)}`);
            throw error;
        }
    }
}

const playerRecordService = new PlayerRecordService();
export default playerRecordService;

/**
 * Calculates the player records for a specific year and game day.
 *
 * @param year - The year for which to calculate the player records.
 * @param yearOutcomes - The outcomes for the entire year.
 * @param yearPlayerRecords - The player records for the entire year.
 * @param gameDay - The game day for which to calculate the player records.
 * @param gameDayOutcomes - The outcomes for the specific game day.
 * @param playerRecords - The existing player records.
 */
async function calculateYearPlayerRecords(
    year: number,
    yearOutcomes: OutcomeType[],
    yearPlayerRecords: Record<number, Partial<PlayerRecordType>>,
    gameDay: GameDayType,
    gameDayOutcomes: OutcomeType[],
    playerRecords: PlayerRecordType[],
) {
    // Start with a list of PlayerRecords, including those for anyone with any
    // standing this year. For each one with an outcome this game day, add or
    // update the PlayerRecord as appropriate

    for (const outcome of gameDayOutcomes) {
        yearPlayerRecords[outcome.playerId] = {
            ...yearPlayerRecords[outcome.playerId],
            ...calculatePlayerRecord(year, gameDay, yearOutcomes, outcome),
        };
    }

    // Update the scores that vary with game day, regardless of whether the
    // player played this game (e.g. stalwart score)

    const gamesPlayed = await gameDayService.getGamesPlayed(year, gameDay.id);

    for (const recordData of Object.values(yearPlayerRecords)) {
        recordData.gameDayId = gameDay.id;
        if (recordData.played && gamesPlayed > 0) {
            recordData.stalwart = Math.round(100.0 * recordData.played / gamesPlayed);
        }
    }

    // Calculate the ranks for the set of PlayerRecords
    const pointsArray = Object.values(yearPlayerRecords)
        .map(r => r.points)
        .filter((p): p is number => p !== null);
    pointsArray.sort((a, b) => b - a);

    const averagesArray = Object.values(yearPlayerRecords)
        .map(r => (r.played && r.played > 0 && r.played >= config.minGamesForAveragesTable ? r.averages : null))
        .filter((a): a is number => a !== null);
    averagesArray.sort((a, b) => b - a);

    const averagesArrayUnqualified = Object.values(yearPlayerRecords)
        .map(r => (r.played && r.played > 0 && r.played < config.minGamesForAveragesTable ? r.averages : null))
        .filter((a): a is number => a !== null);
    averagesArrayUnqualified.sort((a, b) => b - a);

    const stalwartArray = Object.values(yearPlayerRecords)
        .map(r => r.stalwart)
        .filter((s): s is number => s !== null);
    stalwartArray.sort((a, b) => b - a);

    const speedyArray = Object.values(yearPlayerRecords)
        .map(r => (r.responses && r.responses >= config.minRepliesForSpeedyTable ? r.speedy : null))
        .filter((s): s is number => s !== null);
    speedyArray.sort((a, b) => a - b);

    const speedyArrayUnqualified = Object.values(yearPlayerRecords)
        .map(r => (r.responses && r.responses < config.minRepliesForSpeedyTable ? r.speedy : null))
        .filter((s): s is number => s !== null);
    speedyArrayUnqualified.sort((a, b) => a - b);

    const pubArray = Object.values(yearPlayerRecords)
        .map(r => r.pub)
        .filter((p): p is number => p !== null);
    pubArray.sort((a, b) => b - a);

    for (const recordData of Object.values(yearPlayerRecords)) {
        if (recordData.points != null) {
            recordData.rankPoints = pointsArray.indexOf(recordData.points) + 1;
        }
        if (recordData.averages != null) {
            if (recordData.played && recordData.played >= config.minGamesForAveragesTable) {
                recordData.rankAverages = averagesArray.indexOf(recordData.averages) + 1;
                recordData.rankAveragesUnqualified = null;
            } else {
                recordData.rankAveragesUnqualified = averagesArrayUnqualified.indexOf(recordData.averages) + 1;
                recordData.rankAverages = null;
            }
        }
        if (recordData.stalwart != null) {
            recordData.rankStalwart = stalwartArray.indexOf(recordData.stalwart) + 1;
        }
        if (recordData.speedy != null) {
            if (recordData.responses && recordData.responses >= config.minRepliesForSpeedyTable) {
                recordData.rankSpeedy = speedyArray.indexOf(recordData.speedy) + 1;
                recordData.rankSpeedyUnqualified = null;
            } else {
                recordData.rankSpeedyUnqualified = speedyArrayUnqualified.indexOf(recordData.speedy) + 1;
                recordData.rankSpeedy = null;
            }
        }
        if (recordData.pub != null) {
            recordData.rankPub = pubArray.indexOf(recordData.pub) + 1;
        }
    }

    // Upsert the PlayerRecords and add them to the overall list

    for (const recordData of Object.values(yearPlayerRecords)) {
        const playerRecord = await playerRecordService.upsert(recordData as PlayerRecordType);

        if (playerRecord) {
            playerRecords.push(playerRecord);
        }
    }
}

/**
 * Calculates the player record for a specific year and game day based on the
 * provided outcomes.
 * @param year - The year of the player record.
 * @param gameDay - The game day for which the player record is calculated.
 * @param yearOutcomes - The outcomes for the entire year.
 * @param outcome - The outcome for the specific game day.
 * @returns A promise that resolves to a partial player record object.
 */
function calculatePlayerRecord(
    year: number,
    gameDay: GameDayType,
    yearOutcomes: OutcomeType[],
    outcome: OutcomeType,
): Partial<PlayerRecordType> {
    const playerYearOutcomes = yearOutcomes.filter(o => o.playerId === outcome.playerId &&
        o.gameDayId <= gameDay.id);
    const playerYearRespondedOutcomes = playerYearOutcomes.filter(o => o.response != null);
    const playerYearPlayedOutcomes = playerYearOutcomes.filter(o => o.points != null);
    const pub = playerYearOutcomes.reduce((acc, o) => acc + (o.pub ?? 0), 0);
    const data: Partial<PlayerRecordType> = {
        playerId: outcome.playerId,
        year: year,
        gameDayId: gameDay.id,
        responses: playerYearRespondedOutcomes.length,
        ...{ pub: pub > 0 ? pub : null },
    };

    if (playerYearPlayedOutcomes.length > 0) {
        data.played = playerYearPlayedOutcomes.length;
        data.won = playerYearPlayedOutcomes.filter(o => o.points == 3).length;
        data.drawn = playerYearPlayedOutcomes.filter(o => o.points == 1).length;
        data.lost = playerYearPlayedOutcomes.filter(o => o.points == 0).length;
    }

    if (data.played && data.played > 0) {
        data.points = playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points ?? 0), 0);
        data.averages = playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points ?? 0), 0) / data.played;
    }

    const responseIntervals = playerYearOutcomes
        .map(o => o.responseInterval)
        .filter((num): num is number => num !== null);

    if (responseIntervals.length > 0) {
        data.speedy = responseIntervals.reduce((acc, ri) => acc + ri, 0) / responseIntervals.length;
    }

    return data;
}

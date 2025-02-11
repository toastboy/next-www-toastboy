import { GameDay, Outcome, PlayerRecord } from '@prisma/client';
import debug from 'debug';
import config from 'lib/config';
import prisma from 'lib/prisma';
import { rankMap } from 'lib/utils';
import gameDayService from 'services/GameDay';
import outcomeService from 'services/Outcome';

const log = debug('footy:api');

export enum EnumTable {
    points = 'points',
    averages = 'averages',
    stalwart = 'stalwart',
    speedy = 'speedy',
    pub = 'pub',
}

export class PlayerRecordService {
    /**
     * Validate a PlayerRecord
     * @param playerRecord The playerRecord to validate
     * @returns the validated playerRecord
     * @throws An error if the playerRecord is invalid.
     */
    validate(playerRecord: PlayerRecord): PlayerRecord {
        if (playerRecord.year != null && (!Number.isInteger(playerRecord.year) || playerRecord.year < 0)) {
            throw new Error(`Invalid year value: ${playerRecord.year}`);
        }
        if (playerRecord.responses != null && (!Number.isInteger(playerRecord.responses) || playerRecord.responses < 0)) {
            throw new Error(`Invalid responses value: ${playerRecord.responses}`);
        }
        if (playerRecord.played != null && (!Number.isInteger(playerRecord.played) || playerRecord.played < 0)) {
            throw new Error(`Invalid played value: ${playerRecord.played}`);
        }
        if (playerRecord.won != null && (!Number.isInteger(playerRecord.won) || playerRecord.won < 0)) {
            throw new Error(`Invalid won value: ${playerRecord.won}`);
        }
        if (playerRecord.drawn != null && (!Number.isInteger(playerRecord.drawn) || playerRecord.drawn < 0)) {
            throw new Error(`Invalid drawn value: ${playerRecord.drawn}`);
        }
        if (playerRecord.lost != null && (!Number.isInteger(playerRecord.lost) || playerRecord.lost < 0)) {
            throw new Error(`Invalid lost value: ${playerRecord.lost}`);
        }
        if (playerRecord.points != null && (!Number.isInteger(playerRecord.points) || playerRecord.points < 0)) {
            throw new Error(`Invalid points value: ${playerRecord.points}`);
        }
        if (playerRecord.averages != null && playerRecord.averages < 0.0) {
            throw new Error(`Invalid averages value: ${playerRecord.averages}`);
        }
        if (playerRecord.stalwart != null && (!Number.isInteger(playerRecord.stalwart) || playerRecord.stalwart < 0)) {
            throw new Error(`Invalid stalwart value: ${playerRecord.stalwart}`);
        }
        if (playerRecord.pub != null && (!Number.isInteger(playerRecord.pub) || playerRecord.pub < 0)) {
            throw new Error(`Invalid pub value: ${playerRecord.pub}`);
        }
        if (playerRecord.rankPoints != null && (!Number.isInteger(playerRecord.rankPoints) || playerRecord.rankPoints < 0)) {
            throw new Error(`Invalid rankPoints value: ${playerRecord.rankPoints}`);
        }
        if (playerRecord.rankAverages != null && (!Number.isInteger(playerRecord.rankAverages) || playerRecord.rankAverages < 0)) {
            throw new Error(`Invalid rankAverages value: ${playerRecord.rankAverages}`);
        }
        if (playerRecord.rankStalwart != null && (!Number.isInteger(playerRecord.rankStalwart) || playerRecord.rankStalwart < 0)) {
            throw new Error(`Invalid rankStalwart value: ${playerRecord.rankStalwart}`);
        }
        if (playerRecord.rankSpeedy != null && (!Number.isInteger(playerRecord.rankSpeedy) || playerRecord.rankSpeedy < 0)) {
            throw new Error(`Invalid rankSpeedy value: ${playerRecord.rankSpeedy}`);
        }
        if (playerRecord.rankPub != null && (!Number.isInteger(playerRecord.rankPub) || playerRecord.rankPub < 0)) {
            throw new Error(`Invalid rankPub value: ${playerRecord.rankPub}`);
        }
        if (playerRecord.speedy != null && playerRecord.speedy < 0.0) {
            throw new Error(`Invalid speedy value: ${playerRecord.speedy}`);
        }

        if (!Number.isInteger(playerRecord.gameDayId) || playerRecord.gameDayId < 0) {
            throw new Error(`Invalid gameDay value: ${playerRecord.gameDayId}`);
        }
        if (!Number.isInteger(playerRecord.playerId) || playerRecord.playerId < 0) {
            throw new Error(`Invalid player value: ${playerRecord.playerId}`);
        }

        return playerRecord;
    }

    /**
     * Retrieves a PlayerRecord for the given Player ID, year and GameDay ID.
     * @param playerId - The ID of the Player.
     * @param year - The year of the GameDay, or zero for all years.
     * @param gameDayId - The ID of the GameDay.
     * @returns A promise that resolves to the PlayerRecord if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, year: number, gameDayId: number): Promise<PlayerRecord | null> {
        try {
            return prisma.playerRecord.findUnique({
                where: {
                    playerId_year_gameDayId: {
                        playerId: playerId,
                        year: year,
                        gameDayId: gameDayId,
                    },
                },
            });
        } catch (error) {
            log(`Error fetching playerRecords: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all playerRecords.
     * @returns A promise that resolves to an array of playerRecords or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<PlayerRecord[] | null> {
        try {
            return prisma.playerRecord.findMany({});
        } catch (error) {
            log(`Error fetching playerRecords: ${error}`);
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
            log(`Error fetching playerRecords: ${error}`);
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
            log(`Error fetching playerRecords: ${error}`);
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
    async getByGameDay(gameDayId: number, year?: number): Promise<PlayerRecord[] | null> {
        try {
            return prisma.playerRecord.findMany({
                where: {
                    gameDayId: gameDayId,
                    ...(year != undefined ? { year: year } : {}),
                },
            });
        } catch (error) {
            log(`Error fetching playerRecords by GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves playerRecords by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of playerRecords or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<PlayerRecord[] | null> {
        try {
            return prisma.playerRecord.findMany({
                where: {
                    playerId: playerId,
                },
            });
        } catch (error) {
            log(`Error fetching playerRecords by player: ${error}`);
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
    ): Promise<PlayerRecord | null> {
        try {
            return await prisma.playerRecord.findFirst({
                where: {
                    year: year,
                    playerId: playerId,
                },
                orderBy: {
                    gameDayId: 'desc',
                },
            });
        } catch (error) {
            log(`Error fetching playerRecord for player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the winners of a specific table for all years.
     * @param table - The table for which to retrieve the winners.
     * @returns A promise that resolves to an array of PlayerRecord objects
     * representing the winners.
     * @throws If there is an error fetching the player records.
     */
    async getWinners(
        table: EnumTable,
        year?: number,
    ): Promise<PlayerRecord[]> {
        try {
            const rank = rankMap[table as keyof typeof rankMap];
            const seasonEnders = await gameDayService.getSeasonEnders();
            const firstPlaceRecords = await prisma.playerRecord.findMany({
                where: {
                    ...(year != undefined ? { year } : { year: { gt: 0 } }),
                    [rank]: 1,
                },
                orderBy: {
                    year: 'desc',
                },
            });

            return firstPlaceRecords.filter((record) => seasonEnders.includes(record.gameDayId));
        } catch (error) {
            log(`Error fetching playerRecords for winners: ${error}`);
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
        table: EnumTable,
        year: number,
        qualified?: boolean,
        take?: number,
    ): Promise<PlayerRecord[]> {
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

            const rank = `${rankMap[table as keyof typeof rankMap]}${qualified === false ? 'Unqualified' : ''}`;

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
            });
        } catch (error) {
            log(`Error fetching playerRecords for table: ${error}`);
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
    async create(data: PlayerRecord): Promise<PlayerRecord | null> {
        try {
            return await prisma.playerRecord.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating playerRecord: ${error}`);
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
    async upsert(data: PlayerRecord): Promise<PlayerRecord | null> {
        try {
            return await prisma.playerRecord.upsert({
                where: {
                    playerId_year_gameDayId: {
                        playerId: data.playerId,
                        year: data.year,
                        gameDayId: data.gameDayId,
                    },
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting PlayerRecord: ${error}`);
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
    async upsertForGameDay(gameDayId?: number): Promise<PlayerRecord[]> {
        try {
            const today = new Date();
            const allTimeOutcomes = await outcomeService.getAllForYear(0);

            let gameDays = await gameDayService.getAll();
            if (gameDayId) {
                gameDays = gameDays.filter(g => g.id === gameDayId);
            }

            const years = gameDays.map(gd => gd.date.getFullYear());
            const distinctYears = Array.from(new Set(years));

            const playerRecords: PlayerRecord[] = [];
            const allTimePlayerRecords: Record<number, Partial<PlayerRecord>> = {};
            for (const year of distinctYears) {
                const yearPlayerRecords: Record<number, Partial<PlayerRecord>> = {};
                const yearOutcomes = await outcomeService.getAllForYear(year);

                for (const gameDay of gameDays) {
                    if (gameDay.date.getFullYear() !== year || gameDay.date > today) {
                        continue;
                    }

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
            log(`Error upserting PlayerRecord: ${error}`);
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
            await prisma.playerRecord.delete({
                where: {
                    playerId_year_gameDayId: {
                        playerId: playerId,
                        year: year,
                        gameDayId: gameDayId,
                    },
                },
            });
        } catch (error) {
            log(`Error deleting playerRecord: ${error}`);
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
            log(`Error deleting playerRecords: ${error}`);
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
    yearOutcomes: Outcome[],
    yearPlayerRecords: Record<number, Partial<PlayerRecord>>,
    gameDay: GameDay,
    gameDayOutcomes: Outcome[],
    playerRecords: PlayerRecord[],
) {
    // Start with a list of PlayerRecords, including those for anyone with any
    // standing this year. For each one with an outome this game day, add or
    // update the PlayerRecord as appropriate

    for (const outcome of gameDayOutcomes) {
        yearPlayerRecords[outcome.playerId] = {
            ...yearPlayerRecords[outcome.playerId],
            ...await calculatePlayerRecord(year, gameDay, yearOutcomes, outcome),
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
        .map(r => (r.played && r.played >= config.minGamesForAveragesTable ? r.averages : null))
        .filter((a): a is number => a !== null);
    averagesArray.sort((a, b) => b - a);

    const averagesArrayUnqualified = Object.values(yearPlayerRecords)
        .map(r => (r.played && r.played < config.minGamesForAveragesTable ? r.averages : null))
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
        const playerRecord = await playerRecordService.upsert(recordData as PlayerRecord);

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
async function calculatePlayerRecord(
    year: number,
    gameDay: GameDay,
    yearOutcomes: Outcome[],
    outcome: Outcome,
): Promise<Partial<PlayerRecord>> {
    const playerYearOutcomes = yearOutcomes.filter(o => o.playerId === outcome.playerId &&
        o.gameDayId <= gameDay.id);
    const playerYearRespondedOutcomes = playerYearOutcomes.filter(o => o.response != null);
    const playerYearPlayedOutcomes = playerYearOutcomes.filter(o => o.points != null);
    const pub = playerYearOutcomes.reduce((acc, o) => acc + (o.pub ?? 0), 0);
    const data: Partial<PlayerRecord> = {
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
        data.points = playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points || 0), 0);
        data.averages = playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points || 0), 0) / data.played;
    }

    const responseIntervals = playerYearOutcomes
        .map(o => o.responseInterval)
        .filter((num): num is number => num !== null);

    if (responseIntervals.length > 0) {
        data.speedy = responseIntervals.reduce((acc, ri) => acc + ri, 0) / responseIntervals.length;
    }

    return data;
}

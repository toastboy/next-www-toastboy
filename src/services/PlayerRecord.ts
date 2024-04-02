import { PlayerRecord, GameDay, Outcome } from '@prisma/client';
import outcomeService from 'services/Outcome';
import prisma from 'lib/prisma';
import debug from 'debug';
import gameDayService from './GameDay';

const log = debug('footy:api');

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
        if (playerRecord.P != null && (!Number.isInteger(playerRecord.P) || playerRecord.P < 0)) {
            throw new Error(`Invalid P value: ${playerRecord.P}`);
        }
        if (playerRecord.W != null && (!Number.isInteger(playerRecord.W) || playerRecord.W < 0)) {
            throw new Error(`Invalid W value: ${playerRecord.W}`);
        }
        if (playerRecord.D != null && (!Number.isInteger(playerRecord.D) || playerRecord.D < 0)) {
            throw new Error(`Invalid D value: ${playerRecord.D}`);
        }
        if (playerRecord.L != null && (!Number.isInteger(playerRecord.L) || playerRecord.L < 0)) {
            throw new Error(`Invalid L value: ${playerRecord.L}`);
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
        if (playerRecord.rank_points != null && (!Number.isInteger(playerRecord.rank_points) || playerRecord.rank_points < 0)) {
            throw new Error(`Invalid rank_points value: ${playerRecord.rank_points}`);
        }
        if (playerRecord.rank_averages != null && (!Number.isInteger(playerRecord.rank_averages) || playerRecord.rank_averages < 0)) {
            throw new Error(`Invalid rank_averages value: ${playerRecord.rank_averages}`);
        }
        if (playerRecord.rank_stalwart != null && (!Number.isInteger(playerRecord.rank_stalwart) || playerRecord.rank_stalwart < 0)) {
            throw new Error(`Invalid rank_stalwart value: ${playerRecord.rank_stalwart}`);
        }
        if (playerRecord.rank_speedy != null && (!Number.isInteger(playerRecord.rank_speedy) || playerRecord.rank_speedy < 0)) {
            throw new Error(`Invalid rank_speedy value: ${playerRecord.rank_speedy}`);
        }
        if (playerRecord.rank_pub != null && (!Number.isInteger(playerRecord.rank_pub) || playerRecord.rank_pub < 0)) {
            throw new Error(`Invalid rank_pub value: ${playerRecord.rank_pub}`);
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
                    }
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
     * Retrieves playerRecords by GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @returns A promise that resolves to an array of PlayerRecords or null.
     * @throws An error if there is a failure.
     */
    async getByGameDay(gameDayId: number): Promise<PlayerRecord[] | null> {
        try {
            return prisma.playerRecord.findMany({
                where: {
                    gameDayId: gameDayId
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
                    playerId: playerId
                },
            });
        } catch (error) {
            log(`Error fetching playerRecords by player: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new playerRecord.
     * @param data The data for the new playerRecord.
     * @returns A promise that resolves to the created playerRecord, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: PlayerRecord): Promise<PlayerRecord | null> {
        try {
            return await prisma.playerRecord.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating playerRecord: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a PlayerRecord.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted PlayerRecord, or null if the upsert failed.
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
                    }
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
    async upsertForGameDay(gameDayId?: number): Promise<PlayerRecord[] | null> {
        try {
            const today = new Date();
            const allTimeOutcomes = await outcomeService.getAllForYear(0);
            if (!allTimeOutcomes) {
                return null;
            }

            let gameDays = await gameDayService.getAll();
            if (!gameDays) {
                return null;
            }

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
                if (!yearOutcomes) {
                    return null;
                }

                for (const gameDay of gameDays) {
                    if (gameDay.date.getFullYear() !== year || gameDay.date > today) {
                        continue;
                    }

                    const gameDayOutcomes = await outcomeService.getByGameDay(gameDay.id);
                    if (!gameDayOutcomes) {
                        return null;
                    }

                    // TODO: Remove this log
                    console.log(`Game ${gameDay.id}`);

                    // 1. Start with a list of PlayerRecords, including those for anyone with any standing this year
                    // 2. For each one with an outome this game day, add or update the PlayerRecord as appropriate
                    // 3. Update the scores that vary with game day, regardless of whether the player played this game (e.g. stalwart score)
                    // 4. Calculate the ranks for the set of PlayerRecords
                    // 5. Upsert the PlayerRecords

                    await calculateYearPlayerRecords(year, yearOutcomes, yearPlayerRecords, gameDay, gameDayOutcomes, playerRecords);
                    await calculateYearPlayerRecords(0, allTimeOutcomes, allTimePlayerRecords, gameDay, gameDayOutcomes, playerRecords);
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
                    }
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

async function calculateYearPlayerRecords(
    year: number,
    yearOutcomes: Outcome[],
    yearPlayerRecords: Record<number, Partial<PlayerRecord>>,
    gameDay: GameDay,
    gameDayOutcomes: Outcome[],
    playerRecords: PlayerRecord[]
) {
    for (const outcome of gameDayOutcomes) {
        yearPlayerRecords[outcome.playerId] = {
            ...yearPlayerRecords[outcome.playerId],
            ...await calculatePlayerRecord(year, gameDay, yearOutcomes, outcome)
        };
    }

    const gamesPlayed = await gameDayService.getGamesPlayed(year, gameDay.id);

    for (const recordData of Object.values(yearPlayerRecords)) {
        recordData.gameDayId = gameDay.id;
        if (recordData.P && gamesPlayed > 0) {
            recordData.stalwart = Math.round(100.0 * recordData.P / gamesPlayed);
        }
    }

    const pointsArray = Object.values(yearPlayerRecords).map(r => r.points);
    pointsArray.sort((a, b) => (b || 0) - (a || 0));
    const averagesArray = Object.values(yearPlayerRecords).map(r => r.averages);
    averagesArray.sort((a, b) => (b || 0.0) - (a || 0.0));
    const stalwartArray = Object.values(yearPlayerRecords).map(r => r.stalwart);
    stalwartArray.sort((a, b) => (b || 0) - (a || 0));
    const speedyArray = Object.values(yearPlayerRecords).map(r => r.speedy);
    speedyArray.sort((a, b) => (a || 0) - (b || 0));
    const pubArray = Object.values(yearPlayerRecords).map(r => r.pub);
    pubArray.sort((a, b) => (b || 0) - (a || 0));

    for (const recordData of Object.values(yearPlayerRecords)) {
        recordData.rank_points = recordData.points != null ? pointsArray.indexOf(recordData.points) + 1 : null;
        recordData.rank_averages = recordData.averages != null ? averagesArray.indexOf(recordData.averages) + 1 : null;
        recordData.rank_stalwart = recordData.stalwart != null ? stalwartArray.indexOf(recordData.stalwart) + 1 : null;
        recordData.rank_speedy = recordData.speedy != null ? speedyArray.indexOf(recordData.speedy) + 1 : null;
        recordData.rank_pub = recordData.pub != null ? pubArray.indexOf(recordData.pub) + 1 : null;
    }

    for (const recordData of Object.values(yearPlayerRecords)) {
        const playerRecord = await playerRecordService.upsert(recordData as PlayerRecord);

        if (playerRecord) {
            playerRecords.push(playerRecord);
        }
    }
}

async function calculatePlayerRecord(
    year: number,
    gameDay: GameDay,
    yearOutcomes: Outcome[],
    outcome: Outcome
): Promise<Partial<PlayerRecord>> {
    const playerYearOutcomes = yearOutcomes.filter(o => o.playerId === outcome.playerId &&
        o.gameDayId <= gameDay.id);
    const playerYearRespondedOutcomes = playerYearOutcomes.filter(o => o.response != null);
    const playerYearPlayedOutcomes = playerYearOutcomes.filter(o => o.points != null);
    const data: Partial<PlayerRecord> = {
        playerId: outcome.playerId,
        year: year,
        gameDayId: gameDay.id,
        responses: playerYearRespondedOutcomes.length,
    };

    if (playerYearPlayedOutcomes.length > 0) {
        data.P = playerYearPlayedOutcomes.length;
        data.W = playerYearPlayedOutcomes.filter(o => o.points == 3).length;
        data.D = playerYearPlayedOutcomes.filter(o => o.points == 1).length;
        data.L = playerYearPlayedOutcomes.filter(o => o.points == 0).length;
    }

    if (data.P && data.P > 0) {
        data.points = playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points || 0), 0);
        data.averages = playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points || 0), 0) / data.P;
    }

    if (outcome.pub && outcome.pub > 0) {
        data.pub = playerYearOutcomes.reduce((acc, o) => acc + (o.pub || 0), 0);
    }

    const playerYearTimedResponseOutcomes = playerYearRespondedOutcomes.filter(o => o.responseInterval != null);
    if (playerYearTimedResponseOutcomes.length > 0) {
        data.speedy = playerYearTimedResponseOutcomes.reduce((acc, o) =>
            acc + (o.responseInterval != null ? o.responseInterval : 0), 0
        ) / playerYearTimedResponseOutcomes.length;
    }

    return data;
}

import { PlayerRecord } from '@prisma/client';
import outcomeService from 'services/Outcome';
import prisma from 'lib/prisma';
import debug from 'debug';
import gameDayService from './GameDay';
import { Decimal } from '@prisma/client/runtime/library';

const log = debug('footy:api');

export class PlayerRecordService {
    /**
     * Validate a PlayerRecord
     * @param playerRecord The playerRecord to validate
     * @returns the validated playerRecord
     * @throws An error if the playerRecord is invalid.
     */
    validate(playerRecord: PlayerRecord): PlayerRecord {
        if (!playerRecord.year || !Number.isInteger(playerRecord.year) || playerRecord.year < 0) {
            throw new Error(`Invalid year value: ${playerRecord.year}`);
        }
        if (!playerRecord.responses || !Number.isInteger(playerRecord.responses) || playerRecord.responses < 0) {
            throw new Error(`Invalid responses value: ${playerRecord.responses}`);
        }
        if (!playerRecord.P || !Number.isInteger(playerRecord.P) || playerRecord.P < 0) {
            throw new Error(`Invalid P value: ${playerRecord.P}`);
        }
        if (!playerRecord.W || !Number.isInteger(playerRecord.W) || playerRecord.W < 0) {
            throw new Error(`Invalid W value: ${playerRecord.W}`);
        }
        if (!playerRecord.D || !Number.isInteger(playerRecord.D) || playerRecord.D < 0) {
            throw new Error(`Invalid D value: ${playerRecord.D}`);
        }
        if (!playerRecord.L || !Number.isInteger(playerRecord.L) || playerRecord.L < 0) {
            throw new Error(`Invalid L value: ${playerRecord.L}`);
        }
        if (!playerRecord.points || !Number.isInteger(playerRecord.points) || playerRecord.points < 0) {
            throw new Error(`Invalid points value: ${playerRecord.points}`);
        }
        if (!playerRecord.averages || !(playerRecord.averages instanceof Decimal) || playerRecord.averages.lt(0)) {
            throw new Error(`Invalid averages value: ${playerRecord.averages}`);
        }
        if (!playerRecord.stalwart || !Number.isInteger(playerRecord.stalwart) || playerRecord.stalwart < 0) {
            throw new Error(`Invalid stalwart value: ${playerRecord.stalwart}`);
        }
        if (!playerRecord.pub || !Number.isInteger(playerRecord.pub) || playerRecord.pub < 0) {
            throw new Error(`Invalid pub value: ${playerRecord.pub}`);
        }
        if (!playerRecord.rank_points || !Number.isInteger(playerRecord.rank_points) || playerRecord.rank_points < 0) {
            throw new Error(`Invalid rank_points value: ${playerRecord.rank_points}`);
        }
        if (!playerRecord.rank_averages || !Number.isInteger(playerRecord.rank_averages) || playerRecord.rank_averages < 0) {
            throw new Error(`Invalid rank_averages value: ${playerRecord.rank_averages}`);
        }
        if (!playerRecord.rank_stalwart || !Number.isInteger(playerRecord.rank_stalwart) || playerRecord.rank_stalwart < 0) {
            throw new Error(`Invalid rank_stalwart value: ${playerRecord.rank_stalwart}`);
        }
        if (!playerRecord.rank_speedy || !Number.isInteger(playerRecord.rank_speedy) || playerRecord.rank_speedy < 0) {
            throw new Error(`Invalid rank_speedy value: ${playerRecord.rank_speedy}`);
        }
        if (!playerRecord.rank_pub || !Number.isInteger(playerRecord.rank_pub) || playerRecord.rank_pub < 0) {
            throw new Error(`Invalid rank_pub value: ${playerRecord.rank_pub}`);
        }
        if (!playerRecord.speedy || !Number.isInteger(playerRecord.speedy) || playerRecord.speedy < 0) {
            throw new Error(`Invalid speedy value: ${playerRecord.speedy}`);
        }

        if (!playerRecord.gameDayId || !Number.isInteger(playerRecord.gameDayId) || playerRecord.gameDayId < 0) {
            throw new Error(`Invalid gameDay value: ${playerRecord.gameDayId}`);
        }
        if (!playerRecord.playerId || !Number.isInteger(playerRecord.playerId) || playerRecord.playerId < 0) {
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
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting PlayerRecord: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts all PlayerRecords for a single GameDay.
     * @param gameDayId The ID of the GameDay.
     * @returns A promise that resolves to an array of all the upserted PlayerRecords, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsertForGameDay(gameDayId: number): Promise<PlayerRecord[] | null> {
        try {
            const gameDay = await gameDayService.get(gameDayId);
            if (!gameDay) {
                throw new Error(`GameDay not found: ${gameDayId}`);
            }
            const year = gameDay.date.getFullYear();
            const gamesPlayed = await outcomeService.getGamesPlayed(year, gameDayId);
            const allTimeOutcomes = await outcomeService.getAllForYear(0);
            if (!allTimeOutcomes) {
                return null;
            }
            const yearOutcomes = await outcomeService.getAllForYear(year);
            if (!yearOutcomes) {
                return null;
            }
            const gameDayOutcomes = await outcomeService.getByGameDay(gameDayId);
            if (!gameDayOutcomes) {
                return null;
            }

            const playerRecords: PlayerRecord[] = [];
            for (const outcome of gameDayOutcomes) {
                const playerYearOutcomes = yearOutcomes.filter(o => o.playerId === outcome.playerId);
                const playerYearRespondedOutcomes = playerYearOutcomes.filter(o => o.response != null);
                const playerYearPlayedOutcomes = playerYearOutcomes.filter(o => o.points != null);
                const playerRecord = await this.upsert({
                    playerId: outcome.playerId,
                    year: year,
                    gameDayId: gameDayId,
                    responses: playerYearRespondedOutcomes.length,
                    P: playerYearPlayedOutcomes.length,
                    W: playerYearPlayedOutcomes.filter(o => o.points == 3).length,
                    D: playerYearPlayedOutcomes.filter(o => o.points == 1).length,
                    L: playerYearPlayedOutcomes.filter(o => o.points == 0).length,
                    points: playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points || 0), 0),
                    averages: new Decimal(playerYearPlayedOutcomes.reduce((acc, o) => acc + (o.points || 0), 0) / playerYearPlayedOutcomes.length),
                    stalwart: 100.0 * playerYearPlayedOutcomes.length / gamesPlayed,
                    pub: playerYearOutcomes.reduce((acc, o) => acc + (o.pub || 0), 0),
                    rank_points: 0,
                    rank_averages: 0,
                    rank_stalwart: 0,
                    rank_speedy: 0,
                    rank_pub: 0,
                    speedy: playerYearRespondedOutcomes.reduce((acc, o) =>
                        acc + (o.responseTime && gameDay.mailSent ?
                            o.responseTime.getTime() - gameDay.mailSent.getTime() : 0), 0) / 1000 / playerYearRespondedOutcomes.length
                });

                if (playerRecord) {
                    playerRecords.push(playerRecord);
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

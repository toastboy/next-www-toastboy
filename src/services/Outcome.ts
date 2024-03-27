import { Outcome } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class OutcomeService {
    /**
     * Validate an outcome
     * @param outcome The outcome to validate
     * @returns the validated outcome
     * @throws An error if the outcome is invalid.
     */
    validate(outcome: Outcome): Outcome {
        const now = new Date();

        if (outcome.response && !['Yes', 'No', 'Dunno', 'Excused', 'Flaked', 'Injured'].includes(outcome.response)) {
            throw new Error(`Invalid response value: ${outcome.response}`);
        }
        if (outcome.responseTime && (!(outcome.responseTime instanceof Date) || outcome.responseTime > now)) {
            throw new Error(`Invalid responseTime value: ${outcome.responseTime}`);
        }
        if (outcome.points && (!Number.isInteger(outcome.points) || (outcome.points != 0 && outcome.points != 1 && outcome.points != 3))) {
            throw new Error(`Invalid points value: ${outcome.points}`);
        }
        if (outcome.team && !['A', 'B'].includes(outcome.team)) {
            throw new Error(`Invalid team value: ${outcome.team}`);
        }
        if (!outcome.gameDayId || !Number.isInteger(outcome.gameDayId) || outcome.gameDayId < 0) {
            throw new Error(`Invalid gameDay value: ${outcome.gameDayId}`);
        }
        if (!outcome.playerId || !Number.isInteger(outcome.playerId) || outcome.playerId < 0) {
            throw new Error(`Invalid player value: ${outcome.playerId}`);
        }

        return outcome;
    }

    /**
     * Retrieves an Outcome for the given Player ID for the given GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @param playerId - The ID of the Player.
     * @returns A promise that resolves to the Outcome if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(gameDayId: number, playerId: number): Promise<Outcome | null> {
        try {
            return prisma.outcome.findUnique({
                where: {
                    gameDayId_playerId: {
                        gameDayId: gameDayId,
                        playerId: playerId,
                    }
                },
            });
        } catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all outcomes.
     * @returns A promise that resolves to an array of outcomes or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<Outcome[] | null> {
        try {
            return prisma.outcome.findMany({});
        } catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves outcomes by GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @returns A promise that resolves to an array of Outcomes or null.
     * @throws An error if there is a failure.
     */
    async getByGameDay(gameDayId: number): Promise<Outcome[] | null> {
        try {
            return prisma.outcome.findMany({
                where: {
                    gameDayId: gameDayId
                },
            });
        } catch (error) {
            log(`Error fetching outcomes by GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves outcomes by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of outcomes or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<Outcome[] | null> {
        try {
            return prisma.outcome.findMany({
                where: {
                    playerId: playerId
                },
            });
        } catch (error) {
            log(`Error fetching outcomes by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the number of games played by player ID in the given year.
     * @param playerId - The ID of the player.
     * @param year - The year to filter by, or zero for all years.
     * @returns A promise that resolves to the number of games or null.
     * @throws An error if there is a failure.
     */
    async getGamesPlayed(playerId: number, year: number): Promise<number> {
        try {
            return prisma.outcome.count({
                where: {
                    playerId: playerId,
                    points: {
                        not: null
                    },
                    ...(year !== 0 ? {
                        gameDay: {
                            date: {
                                gte: new Date(year, 0, 1),
                                lt: new Date(year + 1, 0, 1)
                            }
                        }
                    } : {})
                },
            });
        } catch (error) {
            log(`Error fetching outcomes by player: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new outcome.
     * @param data The data for the new outcome.
     * @returns A promise that resolves to the created outcome, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: Outcome): Promise<Outcome | null> {
        try {
            return await prisma.outcome.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating outcome: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts an Outcome.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted Outcome, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: Outcome): Promise<Outcome | null> {
        try {
            return await prisma.outcome.upsert({
                where: {
                    gameDayId_playerId: {
                        gameDayId: data.gameDayId,
                        playerId: data.playerId,
                    }
                },
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting Outcome: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes an Outcome.
     * @param gameDayId - The ID of the GameDay.
     * @param playerId - The ID of the Player.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(gameDayId: number, playerId: number): Promise<void> {
        try {
            await prisma.outcome.delete({
                where: {
                    gameDayId_playerId: {
                        gameDayId: gameDayId,
                        playerId: playerId,
                    }
                },
            });
        } catch (error) {
            log(`Error deleting outcome: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all outcomes.
     * @returns A promise that resolves when all outcomes are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.outcome.deleteMany();
        } catch (error) {
            log(`Error deleting outcomes: ${error}`);
            throw error;
        }
    }
}

const outcomeService = new OutcomeService();
export default outcomeService;

import { GameDay } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class GameDayService {
    /**
     * Validate a GameDay
     * @param gameDay The GameDay to validate
     * @returns the validated GameDay
     * @throws An error if the GameDay is invalid.
     */
    validate(gameDay: GameDay): GameDay {
        if (!gameDay.id || !Number.isInteger(gameDay.id) || gameDay.id < 0) {
            throw new Error(`Invalid id value: ${gameDay.id}`);
        }
        if (gameDay.picker_games_history &&
            (!Number.isInteger(gameDay.picker_games_history) ||
                !(gameDay.picker_games_history == 5 || gameDay.picker_games_history == 10))) {
            throw new Error(`Invalid picker_games_history value: ${gameDay.picker_games_history}`);
        }

        return gameDay;
    }

    /**
     * Retrieves a GameDay by its ID.
     * @param id - The ID of the GameDay to retrieve.
     * @returns A Promise that resolves to the GameDay object if found, or null if not found.
     * @throws If there is an error while fetching the GameDay.
     */
    async get(id: number): Promise<GameDay | null> {
        try {
            return prisma.gameDay.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error fetching GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all GameDays.
     * @returns A promise that resolves to an array of GameDays.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<GameDay[]> {
        try {
            return prisma.gameDay.findMany({});
        } catch (error) {
            log(`Error fetching GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves a GameDay object by the specified date.
     * @param date - The date to search for.
     * @returns A Promise that resolves to the GameDay object if found, or null
     * if not found.
     * @throws If there was an error while fetching the GameDay.
     */
    async getByDate(date: Date): Promise<GameDay | null> {
        try {
            return prisma.gameDay.findFirst({
                where: {
                    date: date,
                },
            });
        } catch (error) {
            log(`Error fetching GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the current GameDay: the most recent GameDay where the mail has
     * been sent.
     * @returns A promise that resolves to an array of GameDays.
     * @throws An error if there is a failure.
     */
    async getCurrent(): Promise<GameDay | null> {
        try {
            return prisma.gameDay.findFirst({
                where: {
                    mailSent: {
                        not: null,
                    },
                },
                orderBy: {
                    date: 'desc',
                },
            });
        } catch (error) {
            log(`Error fetching current GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the number of games played in the given year, optionally
     * stopping at a given gameDay ID.
     * @param year - The year to filter by, or zero for all years.
     * @param untilGameDayId - The gameDay ID to stop at (inclusive), or
     * undefined
     * @returns A promise that resolves to the number of games or null.
     * @throws An error if there is a failure.
     */
    async getGamesPlayed(year: number, untilGameDayId?: number): Promise<number> {
        try {
            return prisma.gameDay.count({
                where: {
                    game: true,
                    ...(year !== 0 ? {
                        date: {
                            gte: new Date(year, 0, 1),
                            lt: new Date(year + 1, 0, 1),
                        },
                    } : {}),
                    ...(untilGameDayId ? {
                        id: {
                            lte: untilGameDayId,
                        },
                    } : {}),
                },
            });
        } catch (error) {
            log(`Error counting gameDays: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the number of games yet to be played in the given year.
     * @param year - The year to filter by, or zero for all years.
     * @returns A promise that resolves to the number of games or null.
     * @throws An error if there is a failure.
     */
    async getGamesRemaining(year: number): Promise<number> {
        try {
            return prisma.gameDay.count({
                where: {
                    game: true,
                    AND: [
                        {
                            ...(year !== 0 ? {
                                date: {
                                    gte: new Date(year, 0, 1),
                                    lt: new Date(year + 1, 0, 1),
                                },
                            } : {}),
                        },
                        {
                            date: {
                                gt: new Date(),
                            },
                        },
                    ],
                },
            });
        } catch (error) {
            log(`Error counting gameDays: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the maximum gameDay ID for each year where there is a game.
     * @returns An array of maximum gameDay IDs for each year, or null if there
     * are no games.
     */
    async getSeasonEnders(): Promise<(number | null)[]> {
        try {
            const result = await prisma.gameDay.groupBy({
                by: ['year'],
                where: {
                    game: true,
                },
                _max: {
                    id: true,
                },
            });
            return result.map((r) => r._max.id);
        } catch (error) {
            log(`Error counting gameDays: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all the years from the game days where a game has taken or will
     * take place.
     * @returns A promise that resolves to an array of distinct years.
     * @throws An error if there is a failure.
     */
    async getAllYears(): Promise<number[]> {
        try {
            const gameDays = await prisma.gameDay.findMany({
                where: {
                    game: true,
                },
                select: {
                    year: true,
                },
            });
            const years = gameDays.map(gd => gd.year);
            const distinctYears = Array.from(new Set(years));

            return Promise.resolve(distinctYears);
        } catch (error) {
            log(`Error fetching GameDays: ${error}`);
            throw error;
        }
    }

    /**
     * Checks whether the given year has any games.
     * @returns A promise that resolves to the corresponding game year or null
     * if no games were played or will be played in the given year.
     * @throws An error if there is a failure.
     */
    async getYear(year: number): Promise<number | null> {
        try {
            const gameDay = await prisma.gameDay.findFirst({
                where: {
                    game: true,
                    year: year,
                },
                select: {
                    year: true,
                },
            });

            return gameDay ? Promise.resolve(gameDay.year) : null;
        }
        catch (error) {
            log(`Error fetching GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new gameDay.
     * @param data The data for the new gameDay.
     * @returns A promise that resolves to the created gameDay, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: GameDay): Promise<GameDay | null> {
        try {
            return await prisma.gameDay.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a gameDay.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted gameDay, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: GameDay): Promise<GameDay | null> {
        try {
            return await prisma.gameDay.upsert({
                where: {
                    id: data.id,
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a gameDay by its ID.
     * @param id - The ID of the gameDay to delete.
     * @throws If there is an error deleting the gameDay.
     */
    async delete(id: number): Promise<void> {
        try {
            await prisma.gameDay.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error deleting GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all gameDays.
     * @returns A promise that resolves when all gameDays are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.gameDay.deleteMany();
        } catch (error) {
            log(`Error deleting GameDays: ${error}`);
            throw error;
        }
    }
}

const gameDayService = new GameDayService();
export default gameDayService;

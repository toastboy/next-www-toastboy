import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import { TeamName } from 'lib/types';
import { GameDay as PrismaGameDay } from 'prisma/generated/prisma/client';
import { GameDay } from 'prisma/generated/zod';

const log = debug('footy:api');

export class GameDayService {
    /**
     * Validate a PrismaGameDay
     * @param gameDay The PrismaGameDay to validate
     * @returns the validated PrismaGameDay
     * @throws An error if the PrismaGameDay is invalid.
     */
    validate(gameDay: PrismaGameDay): PrismaGameDay {
        if (!gameDay.id || !Number.isInteger(gameDay.id) || gameDay.id < 0) {
            throw new Error(`Invalid id value: ${gameDay.id}`);
        }
        if (gameDay.pickerGamesHistory &&
            (!Number.isInteger(gameDay.pickerGamesHistory) ||
                !(gameDay.pickerGamesHistory == 5 || gameDay.pickerGamesHistory == 10))) {
            throw new Error(`Invalid pickerGamesHistory value: ${gameDay.pickerGamesHistory}`);
        }

        return gameDay;
    }

    /**
     * Retrieves a GameDayWithOutcomesWithPlayers by its ID.
     * @param id - The ID of the GameDay to retrieve.
     * @returns A Promise that resolves to the GameDay object if found, or null
     * if not found.
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
            log(`Error fetching PrismaGameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all game days based on the provided filters.
     *
     * @param {Object} filters - The filters to apply when retrieving game days.
     * @param {TeamName | string} [filters.bibs] - The team name or bibs to filter by. If "null", it will be treated as null.
     * @param {boolean} [filters.game] - Whether to filter by game status.
     * @param {boolean} [filters.mailSent] - Whether to filter by mail sent status. If true, it will filter for non-null mailSent values.
     * @param {number} [filters.year] - The year to filter by.
     * @returns {Promise<PrismaGameDay[]>} A promise that resolves to an array of PrismaGameDay objects.
     * @throws Will throw an error if there is an issue fetching the game days.
     */
    async getAll({ bibs, game, mailSent, year }: {
        bibs?: TeamName | string,
        game?: boolean,
        mailSent?: boolean,
        year?: number,
    } = {}): Promise<PrismaGameDay[]> {
        try {
            return prisma.gameDay.findMany({
                where: {
                    ...(bibs !== undefined && { bibs: bibs == "null" ? null : bibs as TeamName }),
                    ...(game !== undefined && { game: game }),
                    ...(mailSent !== undefined && { mailSent: mailSent ? { not: null } : null }),
                    ...(year !== undefined && { year: year }),
                },
                orderBy: {
                    date: 'asc',
                },
            });
        } catch (error) {
            log(`Error fetching PrismaGameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves a PrismaGameDay object by the specified date.
     * @param date - The date to search for.
     * @returns A Promise that resolves to the PrismaGameDay object if found, or null
     * if not found.
     * @throws If there was an error while fetching the PrismaGameDay.
     */
    async getByDate(date: Date): Promise<PrismaGameDay | null> {
        try {
            return prisma.gameDay.findFirst({
                where: {
                    date: date,
                },
            });
        } catch (error) {
            log(`Error fetching PrismaGameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the current PrismaGameDay: the most recent PrismaGameDay where the mail has
     * been sent.
     * @returns A promise that resolves to an array of GameDays.
     * @throws An error if there is a failure.
     */
    async getCurrent(): Promise<PrismaGameDay | null> {
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
            log(`Error fetching current PrismaGameDay: ${error}`);
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
            log(`Error fetching PrismaGameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new gameDay.
     * @param data The data for the new gameDay.
     * @returns A promise that resolves to the created gameDay, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: PrismaGameDay): Promise<PrismaGameDay | null> {
        try {
            return await prisma.gameDay.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating PrismaGameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a gameDay.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted gameDay, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: PrismaGameDay): Promise<PrismaGameDay | null> {
        try {
            return await prisma.gameDay.upsert({
                where: {
                    id: data.id,
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting PrismaGameDay: ${error}`);
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
            log(`Error deleting PrismaGameDay: ${error}`);
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

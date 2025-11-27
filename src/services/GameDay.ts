import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    GameDayUncheckedCreateInputObjectZodSchema,
    GameDayUncheckedUpdateInputObjectZodSchema,
    GameDayWhereInputObjectSchema,
    GameDayWhereUniqueInputObjectSchema,
    TeamName,
} from 'prisma/generated/schemas';
import {
    GameDaySchema,
    GameDayType,
} from 'prisma/generated/schemas/models/GameDay.schema';
import z from 'zod';

/** Field definitions with extra validation */
const extendedFields = {
    id: z.number().int().min(0),
    pickerGamesHistory: z.union([z.literal(5), z.literal(10)]).nullable().optional(),
};

/** Schemas for enforcing strict input */
export const GameDayUncheckedCreateInputObjectStrictSchema =
    GameDayUncheckedCreateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const GameDayUncheckedUpdateInputObjectStrictSchema =
    GameDayUncheckedUpdateInputObjectZodSchema.extend({
        ...extendedFields,
    });

const log = debug('footy:api');

export class GameDayService {
    /**
     * Retrieves a GameDayWithOutcomesWithPlayers by its ID.
     * @param id - The ID of the GameDay to retrieve.
     * @returns A Promise that resolves to the GameDay object if found, or null
     * if not found.
     * @throws If there is an error while fetching the GameDay.
     */
    async get(id: number): Promise<GameDayType | null> {
        try {
            const where = GameDayWhereUniqueInputObjectSchema.parse({ id });

            return prisma.gameDay.findUnique({ where });
        } catch (error) {
            log(`Error fetching GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all game days based on the provided filters.
     *
     * @param {Object} filters - The filters to apply when retrieving game days.
     * @param {TeamNameType} [filters.bibs] - The team name or bibs to filter by. If "null", it will be treated as null.
     * @param {boolean} [filters.game] - Whether to filter by game status.
     * @param {boolean} [filters.mailSent] - Whether to filter by mail sent status. If true, it will filter for non-null mailSent values.
     * @param {number} [filters.year] - The year to filter by.
     * @returns {Promise<GameDayType[]>} A promise that resolves to an array of GameDayType objects.
     * @throws Will throw an error if there is an issue fetching the game days.
     */
    async getAll({ bibs, game, mailSent, year }: {
        bibs?: TeamName,
        game?: boolean,
        mailSent?: boolean,
        year?: number,
    } = {}): Promise<GameDayType[]> {
        try {
            const where = GameDayWhereInputObjectSchema.parse({ bibs, game, mailSent, year });

            return prisma.gameDay.findMany({ where });
        } catch (error) {
            log(`Error fetching GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves a GameDayType object by the specified date.
     * @param date - The date to search for.
     * @returns A Promise that resolves to the GameDayType object if found, or null
     * if not found.
     * @throws If there was an error while fetching the GameDayType.
     */
    async getByDate(date: Date): Promise<GameDayType | null> {
        try {
            return prisma.gameDay.findFirst({ where: { date } });
        } catch (error) {
            log(`Error fetching GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the current GameDayType: the most recent GameDayType where the mail has
     * been sent.
     * @returns A promise that resolves to an array of GameDays.
     * @throws An error if there is a failure.
     */
    async getCurrent(): Promise<GameDayType | null> {
        try {
            const where = GameDayWhereInputObjectSchema.parse({ mailSent: { not: null } });

            return prisma.gameDay.findFirst({ where, orderBy: { date: 'desc' } });
        } catch (error) {
            log(`Error fetching current GameDayType: ${String(error)}`);
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
            log(`Error counting gameDays: ${String(error)}`);
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
            log(`Error counting gameDays: ${String(error)}`);
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
            log(`Error counting gameDays: ${String(error)}`);
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
            log(`Error fetching GameDays: ${String(error)}`);
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
            log(`Error fetching GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a new gameDay.
     * @param data The data for the new gameDay.
     * @returns A promise that resolves to the created gameDay, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<GameDayType | null> {
        try {
            const data = GameDayUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.gameDay.create({ data });
        } catch (error) {
            log(`Error creating GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a gameDay.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted gameDay, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<GameDayType | null> {
        try {
            const parsed = GameDaySchema.pick({ id: true }).parse(rawData);
            const where = GameDayWhereUniqueInputObjectSchema.parse({ id: parsed.id });
            const update = GameDayUncheckedUpdateInputObjectStrictSchema.parse(rawData);
            const create = GameDayUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.gameDay.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting GameDayType: ${String(error)}`);
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
            const where = GameDayWhereUniqueInputObjectSchema.parse({ id });

            await prisma.gameDay.delete({ where });
        } catch (error) {
            log(`Error deleting GameDayType: ${String(error)}`);
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
            log(`Error deleting GameDays: ${String(error)}`);
            throw error;
        }
    }
}

const gameDayService = new GameDayService();
export default gameDayService;

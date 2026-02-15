import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    GameDayWhereInputObjectSchema,
    GameDayWhereUniqueInputObjectSchema,
    TeamName,
} from 'prisma/zod/schemas';
import { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    GameDayCreateOneStrictSchema,
    type GameDayUpdateInput,
    GameDayUpdateInputSchema,
    GameDayUpdateOneStrictSchema,
    type GameDayUpsertInput,
    GameDayUpsertInputSchema,
    GameDayUpsertOneStrictSchema,
    type GameDayWriteInput,
    GameDayWriteInputSchema,
} from '@/types/GameDayStrictSchema';
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
     * Retrieves the next upcoming GameDayType where a game is scheduled.
     * @param from - Optional date to compare against; defaults to now.
     */
    async getUpcoming(from: Date = new Date()): Promise<GameDayType | null> {
        try {
            const where = GameDayWhereInputObjectSchema.parse({
                game: true,
                date: { gte: from },
            });

            return prisma.gameDay.findFirst({ where, orderBy: { date: 'asc' } });
        } catch (error) {
            log(`Error fetching upcoming GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the previous `GameDayType` based on the provided `gameDayId`.
     *
     * This method fetches the current game day using the given ID, then finds the most recent
     * game day with a date earlier than the current one. If no such game day exists, it returns `null`.
     *
     * @param gameDayId - The ID of the current game day.
     * @returns A promise that resolves to the previous `GameDayType` or `null` if not found.
     * @throws Will throw an error if fetching fails or an unexpected error occurs.
     */
    async getPrevious(gameDayId: number): Promise<GameDayType | null> {
        try {
            const currentGameDay = await this.get(gameDayId);
            if (!currentGameDay) return null;

            const where = GameDayWhereInputObjectSchema.parse({
                date: { lt: currentGameDay.date },
            });

            return prisma.gameDay.findFirst({ where, orderBy: { date: 'desc' } });
        } catch (error) {
            log(`Error fetching previous GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the most recent GameDay record from the database.
     *
     * @returns A Promise that resolves to the latest GameDay object if found,
     * or null if no records exist.
     * @throws {Error} Throws an error if the database query fails.
     *
     * @remarks
     * This method fetches the GameDay with the highest ID value, assuming IDs
     * are auto-incrementing. The error is logged before being re-thrown to the
     * caller.
     */
    async getLatest(): Promise<GameDayType | null> {
        try {
            return prisma.gameDay.findFirst({ orderBy: { id: 'desc' } });
        } catch (error) {
            log(`Error fetching latest GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the next `GameDayType` that occurs after the specified game day.
     *
     * @param gameDayId - The unique identifier of the current game day.
     * @returns A promise that resolves to the next `GameDayType` if found, or `null` if there is none.
     * @throws Will throw an error if fetching the next game day fails.
     */
    async getNext(gameDayId: number): Promise<GameDayType | null> {
        try {
            const currentGameDay = await this.get(gameDayId);
            if (!currentGameDay) return null;

            const where = GameDayWhereInputObjectSchema.parse({
                date: { gt: currentGameDay.date },
            });

            return prisma.gameDay.findFirst({ where, orderBy: { date: 'asc' } });
        } catch (error) {
            log(`Error fetching next GameDayType: ${String(error)}`);
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
    async getSeasonEnders(until?: Date): Promise<(number | null)[]> {
        try {
            const result = await prisma.gameDay.groupBy({
                by: ['year'],
                where: {
                    game: true,
                    ...(until ? {
                        date: {
                            lte: until,
                        },
                    } : {}),
                },
                _max: {
                    id: true,
                },
            });

            return result?.map((r) => r._max.id) ?? [];
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
     * Creates a game-day record from validated write input.
     * @param data - Write payload for a game day.
     * @returns The created game-day row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: GameDayWriteInput): Promise<GameDayType> {
        try {
            const writeData = GameDayWriteInputSchema.parse(data);
            const args = GameDayCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.gameDay.create(args);
        } catch (error) {
            log(`Error creating GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a game-day record by ID.
     *
     * Note: `id` is only used in `where`. Because create payloads never include
     * `id`, when no row matches the provided id Prisma will insert a new row with
     * a database-generated autoincrement id.
     * @param data - Upsert payload; requires `id` for the unique key.
     * @returns The created or updated game-day row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(data: GameDayUpsertInput): Promise<GameDayType> {
        try {
            const { id, ...writeData } = GameDayUpsertInputSchema.parse(data);
            const args = GameDayUpsertOneStrictSchema.parse({
                where: { id },
                create: writeData,
                update: writeData,
            });
            return await prisma.gameDay.upsert(args);
        } catch (error) {
            log(`Error upserting GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Updates an existing GameDay record using the provided raw input.
     *
     * Parses and validates the identifier and update payload against the
     * corresponding schemas, removes the `id` from the update data, and then
     * issues the update via Prisma. Errors are logged and rethrown.
     *
     * @param data - Update payload containing `id` and mutable fields.
     * @returns The updated GameDay record from the data store.
     * @throws Rethrows any validation or persistence errors encountered.
     */
    async update(data: GameDayUpdateInput): Promise<GameDayType> {
        try {
            const { id, ...writeData } = GameDayUpdateInputSchema.parse(data);
            const args = GameDayUpdateOneStrictSchema.parse({
                where: { id },
                data: writeData,
            });
            return await prisma.gameDay.update(args);
        } catch (error) {
            log(`Error updating GameDayType: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Marks a GameDay as having its mail sent by updating the mailSent timestamp.
     *
     * @param gameDayId - The unique identifier of the GameDay to update
     * @param mailSent - The date when the mail was sent. Defaults to current date/time if not provided
     * @returns A Promise that resolves to the updated GameDay object
     * @throws Will throw an error if the database update fails or if the gameDayId is invalid
     */
    async markMailSent(gameDayId: number, mailSent: Date = new Date()): Promise<GameDayType> {
        try {
            const where = GameDayWhereUniqueInputObjectSchema.parse({ id: gameDayId });

            return await prisma.gameDay.update({
                where,
                data: {
                    mailSent,
                },
            });
        } catch (error) {
            log(`Error marking GameDay mail sent: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a game day by ID.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param id - The ID of the game day to delete.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(id: number): Promise<void> {
        try {
            const where = GameDayWhereUniqueInputObjectSchema.parse({ id });

            await prisma.gameDay.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
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

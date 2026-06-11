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

class GameDayService {
    /**
     * Retrieves a GameDayWithOutcomesWithPlayers by its ID.
     * @param id - The ID of the GameDay to retrieve.
     * @returns A Promise that resolves to the GameDay object if found, or null
     * if not found.
     */
    async get(id: number): Promise<GameDayType | null> {
        const where = GameDayWhereUniqueInputObjectSchema.parse({ id });
        return prisma.gameDay.findUnique({ where });
    }

    /**
     * Retrieves all game days based on the provided filters, sorted by date
     * ascending then ID ascending.
     *
     * @param {Object} filters - The filters to apply when retrieving game days.
     * @param {TeamNameType} [filters.bibs] - The team name or bibs to filter by. If "null", it will be treated as null.
     * @param {boolean} [filters.game] - Whether to filter by game status.
     * @param {boolean} [filters.mailSent] - Whether to filter by mail sent status. If true, it will filter for non-null mailSent values.
     * @param {number} [filters.year] - The year to filter by.
     * @param {Date} [filters.fromDate] - Only return game days on or after this date (inclusive).
     * @param {Date} [filters.beforeDate] - Only return game days before this date (exclusive).
     * @returns {Promise<GameDayType[]>} A promise that resolves to an array of GameDayType objects.
     */
    async getAll({ bibs, game, mailSent, year, fromDate, beforeDate }: {
        bibs?: TeamName,
        game?: boolean,
        mailSent?: boolean,
        year?: number,
        fromDate?: Date,
        beforeDate?: Date,
    } = {}): Promise<GameDayType[]> {
        const where = GameDayWhereInputObjectSchema.parse({
            bibs, game, year: year === 0 ? undefined : year,
        });
        if (mailSent !== undefined) {
            where.mailSent = mailSent ? { not: null } : null;
        }
        if (fromDate !== undefined || beforeDate !== undefined) {
            where.date = {
                ...(fromDate !== undefined ? { gte: fromDate } : {}),
                ...(beforeDate !== undefined ? { lt: beforeDate } : {}),
            };
        }
        return prisma.gameDay.findMany({ where, orderBy: [{ date: 'asc' }, { id: 'asc' }] });
    }

    /**
     * Retrieves the minimum and maximum GameDay IDs for a given year.
     *
     * @param year - The year to filter GameDays by. If `0` or negative, no date
     * filtering is applied and the range is calculated across all GameDays.
     * @returns A promise that resolves to an object containing `minId` and
     * `maxId` for the given year, or `null` if no matching GameDays are found.
     * @throws {Error} If the database query fails.
     */
    async getIdRangeForYear(year: number): Promise<{
        minId: number | null;
        maxId: number | null;
    }> {
        const result = await prisma.gameDay.aggregate({
            where: {
                ...(year > 0 ? {
                    date: {
                        gte: new Date(Date.UTC(year, 0, 1)),
                        lt: new Date(Date.UTC(year + 1, 0, 1)),
                    },
                } : undefined),
            },
            _min: { id: true },
            _max: { id: true },
        });

        return { minId: result._min.id, maxId: result._max.id };
    }

    /**
     * Retrieves a GameDayType object by the specified date.
     * @param date - The date to search for.
     * @returns A Promise that resolves to the GameDayType object if found, or null
     * if not found.
     */
    async getByDate(date: Date): Promise<GameDayType | null> {
        return prisma.gameDay.findFirst({ where: { date } });
    }

    /**
     * Retrieves the current GameDayType: the most recent GameDayType where the mail has
     * been sent.
     * @returns A promise that resolves to the current GameDayType, or null if not found.
     */
    async getCurrent(): Promise<GameDayType | null> {
        const where = GameDayWhereInputObjectSchema.parse({ mailSent: { not: null } });
        return prisma.gameDay.findFirst({ where, orderBy: { date: 'desc' } });
    }

    /**
     * Retrieves the year of the current GameDayType (most recent with mail sent).
     * @returns A Promise that resolves to the year as a number, or null if no current game day exists.
     */
    async getCurrentYear(): Promise<number | null> {
        const currentGame = await this.getCurrent();
        return currentGame ? new Date(currentGame.date).getUTCFullYear() : null;
    }

    /**
     * Retrieves the next upcoming GameDayType where a game is scheduled.
     * @param from - Optional date to compare against; defaults to now.
     */
    async getUpcoming(from: Date = new Date()): Promise<GameDayType | null> {
        const where = GameDayWhereInputObjectSchema.parse({
            game: true,
            date: { gte: from },
        });
        return prisma.gameDay.findFirst({ where, orderBy: { date: 'asc' } });
    }

    /**
     * Retrieves the previous `GameDayType` based on the provided `gameDayId`.
     *
     * @param gameDayId - The ID of the current game day.
     * @returns A promise that resolves to the previous `GameDayType` or `null` if not found.
     */
    async getPrevious(gameDayId: number): Promise<GameDayType | null> {
        const currentGameDay = await this.get(gameDayId);
        if (!currentGameDay) return null;

        const where = GameDayWhereInputObjectSchema.parse({
            date: { lt: currentGameDay.date },
        });

        return prisma.gameDay.findFirst({ where, orderBy: { date: 'desc' } });
    }

    /**
     * Retrieves the most recent GameDay record from the database.
     *
     * @returns A Promise that resolves to the latest GameDay object if found,
     * or null if no records exist.
     */
    async getLatest(): Promise<GameDayType | null> {
        return prisma.gameDay.findFirst({ orderBy: { id: 'desc' } });
    }

    /**
     * Retrieves the next `GameDayType` that occurs after the specified game day.
     *
     * @param gameDayId - The unique identifier of the current game day.
     * @returns A promise that resolves to the next `GameDayType` if found, or `null` if there is none.
     */
    async getNext(gameDayId: number): Promise<GameDayType | null> {
        const currentGameDay = await this.get(gameDayId);
        if (!currentGameDay) return null;

        const where = GameDayWhereInputObjectSchema.parse({
            date: { gt: currentGameDay.date },
        });

        return prisma.gameDay.findFirst({ where, orderBy: { date: 'asc' } });
    }

    /**
     * Retrieves the number of games played in the given year, optionally
     * stopping at a given gameDay ID.
     * @param year - The year to filter by, or zero for all years.
     * @param untilGameDayId - The gameDay ID to stop at (inclusive), or undefined.
     * @returns A promise that resolves to the number of games.
     */
    async getGamesPlayed(year: number, untilGameDayId?: number): Promise<number> {
        return prisma.gameDay.count({
            where: {
                game: true,
                ...(year !== 0 ? {
                    date: {
                        gte: new Date(Date.UTC(year, 0, 1)),
                        lt: new Date(Date.UTC(year + 1, 0, 1)),
                    },
                } : {}),
                ...(untilGameDayId ? {
                    id: {
                        lte: untilGameDayId,
                    },
                } : {}),
            },
        });
    }

    /**
     * Counts cancelled game days.
     *
     * A game day is considered cancelled when `game` is `false` and `mailSent`
     * is not `null`. Results can be filtered by calendar year and optionally
     * limited to game days up to a specific ID.
     *
     * @param year - The calendar year to filter by. If `0`, no year-based date
     * filter is applied.
     * @param untilGameDayId - Optional upper bound for game day IDs (inclusive).
     * @returns The number of matching cancelled game days.
     */
    async getGamesCancelled(year: number, untilGameDayId?: number): Promise<number> {
        return prisma.gameDay.count({
            where: {
                game: false,
                mailSent: { not: null },
                ...(year !== 0 ? {
                    date: {
                        gte: new Date(Date.UTC(year, 0, 1)),
                        lt: new Date(Date.UTC(year + 1, 0, 1)),
                    },
                } : {}),
                ...(untilGameDayId ? {
                    id: {
                        lte: untilGameDayId,
                    },
                } : {}),
            },
        });
    }

    /**
     * Retrieves the number of games yet to be played in the given year.
     * @param year - The year to filter by, or zero for all years.
     * @returns A promise that resolves to the number of games.
     */
    async getGamesRemaining(year: number): Promise<number> {
        return prisma.gameDay.count({
            where: {
                game: true,
                AND: [
                    {
                        ...(year !== 0 ? {
                            date: {
                                gte: new Date(Date.UTC(year, 0, 1)),
                                lt: new Date(Date.UTC(year + 1, 0, 1)),
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
    }

    /**
     * Retrieves the IDs of the last game day for each season.
     *
     * @param until - Optional date to filter game days up to and including this
     * date
     * @returns A promise that resolves to an array of game day IDs representing
     * season enders, or null for seasons where no game day exists
     * @throws Will throw an error if the database query fails
     *
     * @example
     * ```typescript
     * // Get all season enders
     * const seasonEnders = await getSeasonEnders();
     *
     * // Get season enders up to a specific date
     * const seasonEnders = await getSeasonEnders(new Date('2023-12-31'));
     * ```
     */
    async getSeasonEnders(until?: Date): Promise<(number | null)[]> {
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
    }

    /**
     * Retrieves the list of distinct years that have at least one game day
     * marked as a game.
     *
     * Optionally includes `0` as a synthetic "All Time" year when
     * `includeAllTime` is `true`.
     *
     * @param includeAllTime - Whether to include `0` in the returned list to
     * represent "All Time". Defaults to `false`.
     * @returns A promise that resolves to an array of unique year values.
     */
    async getAllYears({
        includeAllTime = false,
        mostRecentFirst = false,
    }): Promise<number[]> {
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
        if (mostRecentFirst) distinctYears.sort((a, b) => b - a);
        if (includeAllTime) {
            if (mostRecentFirst) distinctYears.unshift(0);
            else distinctYears.push(0);
        }
        return Promise.resolve(distinctYears);
    }

    /**
     * Checks whether the given year has any games.
     * @returns A promise that resolves to the corresponding game year or null
     * if no games were played or will be played in the given year.
     */
    async getYear(year: number): Promise<number | null> {
        const gameDay = await prisma.gameDay.findFirst({
            where: {
                game: true,
                year: year,
            },
            select: {
                year: true,
            },
        });

        return gameDay ? gameDay.year : null;
    }

    /**
     * Creates a game-day record from validated write input.
     * @param data - Write payload for a game day.
     * @returns The created game-day row.
     */
    async create(data: GameDayWriteInput): Promise<GameDayType> {
        const writeData = GameDayWriteInputSchema.parse(data);
        const args = GameDayCreateOneStrictSchema.parse({ data: writeData });
        return prisma.gameDay.create(args);
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
        const { id, ...writeData } = GameDayUpsertInputSchema.parse(data);
        const args = GameDayUpsertOneStrictSchema.parse({
            where: { id },
            create: writeData,
            update: writeData,
        });
        return prisma.gameDay.upsert(args);
    }

    /**
     * Updates an existing GameDay record using the provided raw input.
     *
     * @param data - Update payload containing `id` and mutable fields.
     * @returns The updated GameDay record from the data store.
     */
    async update(data: GameDayUpdateInput): Promise<GameDayType> {
        const { id, ...writeData } = GameDayUpdateInputSchema.parse(data);
        const args = GameDayUpdateOneStrictSchema.parse({
            where: { id },
            data: writeData,
        });
        return prisma.gameDay.update(args);
    }

    /**
     * Marks a GameDay as having its mail sent by updating the mailSent timestamp.
     *
     * @param gameDayId - The unique identifier of the GameDay to update.
     * @param mailSent - The date when the mail was sent. Defaults to current date/time if not provided.
     * @returns A Promise that resolves to the updated GameDay object.
     */
    async markMailSent(gameDayId: number, mailSent: Date = new Date()): Promise<GameDayType> {
        const where = GameDayWhereUniqueInputObjectSchema.parse({ id: gameDayId });
        return prisma.gameDay.update({
            where,
            data: {
                mailSent,
            },
        });
    }

    /**
     * Retrieves all game days in a given calendar month, ordered by date.
     *
     * @param year - The calendar year (e.g. 2026)
     * @param month - The calendar month, 1-based (1=January, 12=December)
     * @returns A promise that resolves to an array of GameDayType objects for
     * that month, ascending by date.
     */
    async getForMonth(year: number, month: number): Promise<GameDayType[]> {
        const from = new Date(Date.UTC(year, month - 1, 1));
        const to = new Date(Date.UTC(year, month, 1));

        return prisma.gameDay.findMany({
            where: {
                date: { gte: from, lt: to },
            },
            orderBy: { date: 'asc' },
        });
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
            throw error;
        }
    }

    /**
     * Deletes all gameDays.
     * @returns A promise that resolves when all gameDays are deleted.
     */
    async deleteAll(): Promise<void> {
        await prisma.gameDay.deleteMany();
    }
}

const gameDayService = new GameDayService();
export default gameDayService;

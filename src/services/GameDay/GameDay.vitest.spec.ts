import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import gameDayService from '@/services/GameDay';
import { defaultGameDay, defaultGameDayList } from '@/tests/mocks/data/gameDay';
import type { GameDayUpsertInput, GameDayWriteInput } from '@/types/GameDayStrictSchema';

describe('GameDayService', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (prisma.gameDay.findUnique as Mock).mockImplementation((args: {
            where: {
                id: number
            }
        }) => {
            const gameDay = defaultGameDayList.find((gameDay) => gameDay.id === args.where.id);
            return Promise.resolve(gameDay ?? null);
        });

        (prisma.gameDay.findMany as Mock).mockImplementation((args: {
            where: {
                game?: boolean,
                date?: {
                    gte: Date,
                    lt: Date,
                },
                id?: {
                    lte: number,
                },
            }
        }) => {
            const gameDays = args.where ? defaultGameDayList.filter((gameDay) =>
                (args.where.game ? gameDay.game === args.where.game : true) &&
                (args.where.id ? gameDay.id <= args.where.id.lte : true) &&
                (args.where.date ? gameDay.date >= args.where.date.gte : true) &&
                (args.where.date ? gameDay.date < args.where.date.lt : true),
            ) : defaultGameDayList;
            return Promise.resolve(gameDays ? gameDays : null);
        });

        (prisma.gameDay.count as Mock).mockImplementation((args: {
            where: {
                game?: boolean,
                date?: {
                    gte: Date,
                    lt: Date,
                },
                id?: {
                    lte: number,
                },
                AND?: [
                    {
                        date?: {
                            gte: Date,
                            lt: Date,
                        },
                    },
                    {
                        date?: {
                            gt: Date
                        }
                    }
                ]
            }
        }) => {
            const gameDays = args.where ? defaultGameDayList.filter((gameDay) =>
                (args.where.game ? gameDay.game === args.where.game : true) &&
                (args.where.id ? gameDay.id <= args.where.id.lte : true) &&
                (args.where.date ? gameDay.date >= args.where.date.gte : true) &&
                (args.where.date ? gameDay.date < args.where.date.lt : true) &&
                (args.where.AND?.[0].date ? gameDay.date >= args.where.AND[0].date.gte : true) &&
                (args.where.AND?.[0].date ? gameDay.date < args.where.AND[0].date.lt : true) &&
                (args.where.AND?.[1].date ? gameDay.date > args.where.AND[1].date.gt : true),
            ) : defaultGameDayList;
            return Promise.resolve(gameDays ? gameDays.length : null);
        });

        (prisma.gameDay.create as Mock).mockImplementation((args: { data: Omit<GameDayType, 'id'> }) => {
            return Promise.resolve({
                id: defaultGameDayList.length + 1,
                ...args.data,
            });
        });

        (prisma.gameDay.upsert as Mock).mockImplementation((args: {
            where: { id: number },
            update: Partial<GameDayType>,
            create: Omit<Partial<GameDayType>, 'id'>,
        }) => {
            const gameDay = defaultGameDayList.find((gameDay) => gameDay.id === args.where.id);

            if (gameDay) {
                return Promise.resolve({
                    ...gameDay,
                    ...args.update,
                    id: args.where.id,
                });
            }
            else {
                return Promise.resolve({
                    ...args.create,
                    id: defaultGameDayList.length + 1,
                });
            }
        });

        (prisma.gameDay.update as Mock).mockImplementation((args: {
            where: { id: number },
            data: Partial<GameDayType>,
        }) => {
            const gameDay = defaultGameDayList.find((gameDay) => gameDay.id === args.where.id);

            if (!gameDay) {
                return Promise.reject(new Error('gameDay does not exist'));
            }

            return Promise.resolve({
                ...gameDay,
                ...args.data,
            });
        });

        (prisma.gameDay.delete as Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameDay = defaultGameDayList.find((gameDay) => gameDay.id === args.where.id);
            return Promise.resolve(gameDay ?? null);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct GameDay with id 6', async () => {
            const result = await gameDayService.get(6);
            expect(result).toEqual(defaultGameDayList[5]);
        });

        it('should return null for id 107', async () => {
            const result = await gameDayService.get(107);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return the correct, complete list of 100 GameDays', async () => {
            const result = await gameDayService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].id).toBe(12);
        });

        it('should filter GameDays by game=true', async () => {
            const result = await gameDayService.getAll({ game: true });
            expect(result).toHaveLength(100);
            expect(result.every((gd) => gd.game === true)).toBe(true);
        });

        it('should filter GameDays by game=false', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                defaultGameDayList.filter((gd) => gd.game === false),
            );
            const result = await gameDayService.getAll({ game: false });
            expect(result).toHaveLength(0);
        });

        it('should filter GameDays by year 2021', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                defaultGameDayList.filter((gd) => gd.year === 2021),
            );
            const result = await gameDayService.getAll({ year: 2021 });
            expect(result).toHaveLength(100);
            expect(result.every((gd) => gd.year === 2021)).toBe(true);
        });

        it('should filter GameDays by year 9999 and return empty array', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                defaultGameDayList.filter((gd) => gd.year === 9999),
            );
            const result = await gameDayService.getAll({ year: 9999 });
            expect(result).toHaveLength(0);
        });

        it('should combine year and game filters', async () => {
            const filteredGameDays = defaultGameDayList.filter(
                (gd) => gd.year === 2021 && gd.game === true,
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue(filteredGameDays);
            const result = await gameDayService.getAll({ year: 2021, game: true });
            expect(result).toHaveLength(filteredGameDays.length);
            expect(result.every((gd) => gd.year === 2021 && gd.game === true)).toBe(true);
        });

        it('should filter GameDays by before parameter', async () => {
            const filteredGameDays = defaultGameDayList.filter((gd) => gd.id < 50);
            (prisma.gameDay.findMany as Mock).mockResolvedValue(filteredGameDays);
            const result = await gameDayService.getAll({ before: 50 });
            expect(result).toHaveLength(49);
            expect(result.every((gd) => gd.id < 50)).toBe(true);
        });

        it('should filter GameDays by onOrAfter parameter', async () => {
            const filteredGameDays = defaultGameDayList.filter((gd) => gd.id >= 75);
            (prisma.gameDay.findMany as Mock).mockResolvedValue(filteredGameDays);
            const result = await gameDayService.getAll({ onOrAfter: 75 });
            expect(result).toHaveLength(26);
            expect(result.every((gd) => gd.id >= 75)).toBe(true);
        });

        it('should combine before and game filters', async () => {
            const filteredGameDays = defaultGameDayList.filter(
                (gd) => gd.id < 50 && gd.game === true,
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue(filteredGameDays);
            const result = await gameDayService.getAll({ before: 50, game: true });
            expect(result.every((gd) => gd.id < 50 && gd.game === true)).toBe(true);
        });

        it('should combine onOrAfter and year filters', async () => {
            const filteredGameDays = defaultGameDayList.filter(
                (gd) => gd.id >= 75 && gd.year === 2021,
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue(filteredGameDays);
            const result = await gameDayService.getAll({ onOrAfter: 75, year: 2021 });
            expect(result.every((gd) => gd.id >= 75 && gd.year === 2021)).toBe(true);
        });
    });

    describe('getByDate', () => {
        it('should retrieve the correct GameDay with date 2021-01-03', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDay);
            const result = await gameDayService.getByDate(new Date('2021-01-03'));
            expect(result).toEqual(defaultGameDay);
            expect(prisma.gameDay.findFirst).toHaveBeenCalledWith({
                where: {
                    date: new Date('2021-01-03'),
                },
            });
        });
    });

    describe('getCurrent', () => {
        it('should return the correct, current GameDay where one exists', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDay);
            const result = await gameDayService.getCurrent();
            expect(result).toEqual(defaultGameDay);
            expect(prisma.gameDay.findFirst).toHaveBeenCalledWith({
                where: {
                    mailSent: {
                        not: null,
                    },
                },
                orderBy: {
                    date: 'desc',
                },
            });
        });

        it('should return null where no GameDay with sent email exists', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getCurrent();
            expect(result).toBeNull();
        });
    });

    describe('getPrevious', () => {
        it('should return the correct previous GameDay for gameDayId 6', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDayList[4]);
            const result = await gameDayService.getPrevious(6);
            expect(result).toEqual(defaultGameDayList[4]);
        });

        it('should return null for gameDayId 1', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getPrevious(1);
            expect(result).toBeNull();
        });
    });

    describe('getLatest', () => {
        it('should return the most recent GameDay ordered by date descending', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDayList[99]);
            const result = await gameDayService.getLatest();
            expect(result).toEqual(defaultGameDayList[99]);
            expect(prisma.gameDay.findFirst).toHaveBeenCalledWith({
                orderBy: {
                    id: 'desc',
                },
            });
        });

        it('should return null when no GameDays exist', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getLatest();
            expect(result).toBeNull();
        });
    });

    describe('getNext', () => {
        it('should return the correct next GameDay for gameDayId 6', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDayList[6]);
            const result = await gameDayService.getNext(6);
            expect(result).toEqual(defaultGameDayList[6]);
        });

        it('should return null for the last gameDayId 100', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getNext(100);
            expect(result).toBeNull();
        });
    });

    describe('getGamesPlayed', () => {
        it('should return the correct number of games played for year 2021', async () => {
            const result = await gameDayService.getGamesPlayed(2021);
            expect(result).toBe(52);
        });

        it('should return the correct number of games played for all years', async () => {
            const result = await gameDayService.getGamesPlayed(0);
            expect(result).toBe(100);
        });

        it('should return zero games played for year 9999', async () => {
            const result = await gameDayService.getGamesPlayed(9999);
            expect(result).toBe(0);
        });
    });

    describe('getGamesRemaining', () => {
        it('should return the correct number of games remaining for year 2021', async () => {
            const result = await gameDayService.getGamesRemaining(2021);
            expect(result).toBe(0);
        });

        it('should return the correct number of games remaining for all years', async () => {
            const result = await gameDayService.getGamesRemaining(0);
            expect(result).toBe(0);
        });

        it('should return zero games remaining for year 9999', async () => {
            const result = await gameDayService.getGamesRemaining(9999);
            expect(result).toBe(0);
        });
    });

    describe('getSeasonEnders', () => {
        it('should return the correct, complete list of last GameDays with a game for each year', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
                {
                    _max: {
                        id: 35,
                    },
                    year: 2002,
                },
                {
                    _max: {
                        id: 94,
                    },
                    year: 2003,
                },
                {
                    _max: {
                        id: 146,
                    },
                    year: 2004,
                },
                {
                    _max: {
                        id: 199,
                    },
                    year: 2005,
                },
                {
                    _max: {
                        id: 251,
                    },
                    year: 2006,
                },
                {
                    _max: {
                        id: 303,
                    },
                    year: 2007,
                },
                {
                    _max: {
                        id: 355,
                    },
                    year: 2008,
                },
                {
                    _max: {
                        id: 407,
                    },
                    year: 2009,
                },
                {
                    _max: {
                        id: 459,
                    },
                    year: 2010,
                },
                {
                    _max: {
                        id: 511,
                    },
                    year: 2011,
                },
                {
                    _max: {
                        id: 564,
                    },
                    year: 2012,
                },
                {
                    _max: {
                        id: 616,
                    },
                    year: 2013,
                },
                {
                    _max: {
                        id: 668,
                    },
                    year: 2014,
                },
                {
                    _max: {
                        id: 720,
                    },
                    year: 2015,
                },
                {
                    _max: {
                        id: 773,
                    },
                    year: 2016,
                },
                {
                    _max: {
                        id: 824,
                    },
                    year: 2017,
                },
                {
                    _max: {
                        id: 872,
                    },
                    year: 2018,
                },
                {
                    _max: {
                        id: 928,
                    },
                    year: 2019,
                },
                {
                    _max: {
                        id: 941,
                    },
                    year: 2020,
                },
                {
                    _max: {
                        id: 1028,
                    },
                    year: 2021,
                },
                {
                    _max: {
                        id: 1085,
                    },
                    year: 2022,
                },
                {
                    _max: {
                        id: 1137,
                    },
                    year: 2023,
                },
                {
                    _max: {
                        id: 1170,
                    },
                    year: 2024,
                },
            ]);
            const result = await gameDayService.getSeasonEnders();
            expect(result).toHaveLength(23);
            expect(result[11]).toBe(616);
        });
    });

    describe('getAllYears', () => {
        it('should return the correct, complete list of a single year, 2021', async () => {
            const result = await gameDayService.getAllYears();
            expect(result).toHaveLength(1);
            expect(result[0]).toBe(2021);
        });
    });

    describe('getYear', () => {
        it('should return the year when called with a year that has games played or to be played', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDay);
            const result = await gameDayService.getYear(2021);
            expect(result).toBe(2021);
        });

        it('should return null when called with a year that has no games played or to be played', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getYear(1966);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a GameDay', async () => {
            const newGameDay: GameDayWriteInput = {
                year: defaultGameDay.year,
                date: defaultGameDay.date,
                game: defaultGameDay.game,
                cost: defaultGameDay.cost,
                mailSent: defaultGameDay.mailSent,
                comment: defaultGameDay.comment,
                bibs: defaultGameDay.bibs,
                pickerGamesHistory: 10,
            };
            const result = await gameDayService.create(newGameDay);
            expect(prisma.gameDay.create).toHaveBeenCalledWith({ data: newGameDay });
            expect(result).toEqual({
                ...newGameDay,
                id: 101,
            });
        });

        it('should refuse to create a GameDay with invalid data', async () => {
            await expect(gameDayService.create({
                ...defaultGameDay,
                pickerGamesHistory: 7,
            } as unknown as GameDayWriteInput)).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a GameDay with a database-generated id when where.id is missing', async () => {
            const gameDay: GameDayUpsertInput = {
                id: 1001,
                year: defaultGameDay.year,
                date: defaultGameDay.date,
                game: defaultGameDay.game,
                cost: defaultGameDay.cost,
                mailSent: defaultGameDay.mailSent,
                comment: defaultGameDay.comment,
                bibs: defaultGameDay.bibs,
                pickerGamesHistory: 10,
            };
            const result = await gameDayService.upsert(gameDay);
            expect(result).toEqual({
                ...gameDay,
                id: 101,
            });
        });

        it('should update an existing GameDay where one with the id already existed', async () => {
            const updatedGameDay: GameDayUpsertInput = {
                id: 6,
                year: defaultGameDay.year,
                date: defaultGameDay.date,
                game: defaultGameDay.game,
                cost: defaultGameDay.cost,
                mailSent: defaultGameDay.mailSent,
                comment: defaultGameDay.comment,
                bibs: defaultGameDay.bibs,
                pickerGamesHistory: 10,
            };
            const result = await gameDayService.upsert(updatedGameDay);
            expect(result).toEqual(updatedGameDay);
        });
    });

    describe('update', () => {
        it('should update mutable fields while keeping id in the where clause', async () => {
            const result = await gameDayService.update({
                id: 6,
                game: false,
                comment: 'Pitch frozen',
            });

            expect(prisma.gameDay.update).toHaveBeenCalledWith({
                where: {
                    id: 6,
                },
                data: {
                    game: false,
                    comment: 'Pitch frozen',
                },
            });
            expect(result).toEqual({
                ...defaultGameDayList[5],
                game: false,
                comment: 'Pitch frozen',
            });
        });
    });

    describe('markMailSent', () => {
        it('should set mailSent to the provided date', async () => {
            const mailSent = new Date('2024-02-01T10:00:00Z');

            const result = await gameDayService.markMailSent(6, mailSent);

            expect(prisma.gameDay.update).toHaveBeenCalledWith({
                where: {
                    id: 6,
                },
                data: {
                    mailSent,
                },
            });
            expect(result.mailSent).toEqual(mailSent);
        });

        it('should default mailSent to the current date when none is provided', async () => {
            const now = new Date('2024-03-15T12:00:00Z');
            vi.useFakeTimers();
            vi.setSystemTime(now);

            try {
                const result = await gameDayService.markMailSent(7);

                expect(prisma.gameDay.update).toHaveBeenCalledWith({
                    where: {
                        id: 7,
                    },
                    data: {
                        mailSent: now,
                    },
                });
                expect(result.mailSent).toEqual(now);
            }
            finally {
                vi.useRealTimers();
            }
        });

        it('should surface errors from the update operation', async () => {
            await expect(gameDayService.markMailSent(-1)).rejects.toThrow('gameDay does not exist');
            expect(prisma.gameDay.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        it('should delete an existing GameDay', async () => {
            await gameDayService.delete(6);
            expect(prisma.gameDay.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a GameDay that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.gameDay.delete as Mock).mockRejectedValueOnce(notFoundError);
            await gameDayService.delete(107);
            expect(prisma.gameDay.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all GameDays', async () => {
            await gameDayService.deleteAll();
            expect(prisma.gameDay.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

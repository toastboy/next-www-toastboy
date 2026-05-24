import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import gameDayService from '@/services/GameDay';
import { defaultGameDay, defaultGameDayList } from '@/tests/mocks/data/gameDay';
import type { GameDayUpsertInput, GameDayWriteInput } from '@/types/GameDayStrictSchema';

describe('GameDayService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct GameDay with id 6', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(defaultGameDayList[5]);
            const result = await gameDayService.get(6);
            expect(prisma.gameDay.findUnique).toHaveBeenCalledWith({ where: { id: 6 } });
            expect(result).toEqual(defaultGameDayList[5]);
        });

        it('should return null for id 107', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await gameDayService.get(107);
            expect(prisma.gameDay.findUnique).toHaveBeenCalledWith({ where: { id: 107 } });
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all GameDays', async () => {
            const fixture = [defaultGameDay, { ...defaultGameDay, id: 2 }];
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll();
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: {} });
            expect(result).toEqual(fixture);
        });

        it('should filter GameDays by game=true', async () => {
            const fixture = [defaultGameDay, { ...defaultGameDay, id: 2 }];
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ game: true });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { game: true } });
            expect(result).toEqual(fixture);
        });

        it('should filter GameDays by game=false', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([]);
            const result = await gameDayService.getAll({ game: false });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { game: false } });
            expect(result).toEqual([]);
        });

        it('should filter GameDays by year 2021', async () => {
            const fixture = [defaultGameDay, { ...defaultGameDay, id: 2 }];
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ year: 2021 });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { year: 2021 } });
            expect(result).toEqual(fixture);
        });

        it('should filter GameDays by year 9999 and return empty array', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([]);
            const result = await gameDayService.getAll({ year: 9999 });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { year: 9999 } });
            expect(result).toHaveLength(0);
        });

        it('should combine year and game filters', async () => {
            const fixture = [defaultGameDay];
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ year: 2021, game: true });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { year: 2021, game: true } });
            expect(result).toEqual(fixture);
        });

        it('should filter GameDays by before parameter', async () => {
            const fixture = defaultGameDayList.filter((gd) => gd.id < 50);
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ before: 50 });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { id: { lt: 50 } } });
            expect(result).toHaveLength(49);
            expect(result.every((gd) => gd.id < 50)).toBe(true);
        });

        it('should filter GameDays by onOrAfter parameter', async () => {
            const fixture = defaultGameDayList.filter((gd) => gd.id >= 75);
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ onOrAfter: 75 });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { id: { gte: 75 } } });
            expect(result).toHaveLength(26);
            expect(result.every((gd) => gd.id >= 75)).toBe(true);
        });

        it('should combine before and game filters', async () => {
            const fixture = defaultGameDayList.filter(
                (gd) => gd.id < 50 && gd.game === true,
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ before: 50, game: true });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { game: true, id: { lt: 50 } } });
            expect(result.every((gd) => gd.id < 50 && gd.game === true)).toBe(true);
        });

        it('should combine onOrAfter and year filters', async () => {
            const fixture = defaultGameDayList.filter(
                (gd) => gd.id >= 75 && gd.year === 2021,
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ onOrAfter: 75, year: 2021 });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { year: 2021, id: { gte: 75 } } });
            expect(result.every((gd) => gd.id >= 75 && gd.year === 2021)).toBe(true);
        });

        it('should filter GameDays where mailSent is not null', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([defaultGameDay]);
            const result = await gameDayService.getAll({ mailSent: true });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { mailSent: { not: null } } });
            expect(result).toHaveLength(1);
        });

        it('should filter GameDays where mailSent is null', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([]);
            const result = await gameDayService.getAll({ mailSent: false });
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({ where: { mailSent: null } });
            expect(result).toHaveLength(0);
        });
    });

    describe('getIdRangeForYear', () => {
        it('should return minId and maxId for a specific year', async () => {
            (prisma.gameDay.aggregate as Mock).mockResolvedValue({
                _min: { id: 12 },
                _max: { id: 44 },
            });

            const result = await gameDayService.getIdRangeForYear(2025);

            expect(prisma.gameDay.aggregate).toHaveBeenCalledWith({
                where: {
                    date: {
                        gte: new Date(2025, 0, 1),
                        lt: new Date(2026, 0, 1),
                    },
                },
                _min: { id: true },
                _max: { id: true },
            });
            expect(result).toEqual({ minId: 12, maxId: 44 });
        });

        it('should return nulls when no game days exist for the requested year', async () => {
            (prisma.gameDay.aggregate as Mock).mockResolvedValue({
                _min: { id: null },
                _max: { id: null },
            });

            const result = await gameDayService.getIdRangeForYear(2035);

            expect(prisma.gameDay.aggregate).toHaveBeenCalledWith({
                where: {
                    date: {
                        gte: new Date(2035, 0, 1),
                        lt: new Date(2036, 0, 1),
                    },
                },
                _min: { id: true },
                _max: { id: true },
            });
            expect(result).toEqual({
                minId: null,
                maxId: null,
            });
        });

        it('should query across all years when year is zero', async () => {
            (prisma.gameDay.aggregate as Mock).mockResolvedValue({
                _min: { id: 1 },
                _max: { id: 200 },
            });

            const result = await gameDayService.getIdRangeForYear(0);

            expect(prisma.gameDay.aggregate).toHaveBeenCalledWith({
                where: {},
                _min: { id: true },
                _max: { id: true },
            });
            expect(result).toEqual({ minId: 1, maxId: 200 });
        });

        it('should throw when aggregate fails', async () => {
            (prisma.gameDay.aggregate as Mock).mockRejectedValue(new Error('Database failure'));

            await expect(gameDayService.getIdRangeForYear(2024)).rejects.toThrow('Database failure');
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

    describe('getCurrentYear', () => {
        it('returns the year of the current game day', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDay); // date: 2021-01-03
            const result = await gameDayService.getCurrentYear();
            expect(result).toBe(2021);
        });

        it('returns null when no current game day exists', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getCurrentYear();
            expect(result).toBeNull();
        });
    });

    describe('getUpcoming', () => {
        it('should return the next upcoming GameDay with a game scheduled', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDayList[0]);
            const from = new Date('2021-01-01');
            const result = await gameDayService.getUpcoming(from);
            expect(result).toEqual(defaultGameDayList[0]);
            expect(prisma.gameDay.findFirst).toHaveBeenCalledWith({
                where: {
                    game: true,
                    date: { gte: from },
                },
                orderBy: { date: 'asc' },
            });
        });

        it('should return null when no upcoming GameDay exists', async () => {
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getUpcoming(new Date('2030-01-01'));
            expect(result).toBeNull();
        });
    });

    describe('getPrevious', () => {
        it('should return the correct previous GameDay for gameDayId 6', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(defaultGameDayList[5]);
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDayList[4]);
            const result = await gameDayService.getPrevious(6);
            expect(result).toEqual(defaultGameDayList[4]);
        });

        it('should return null for gameDayId 1', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(defaultGameDayList[0]);
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getPrevious(1);
            expect(result).toBeNull();
        });

        it('should return null when the gameDayId does not exist', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await gameDayService.getPrevious(9999);
            expect(result).toBeNull();
            expect(prisma.gameDay.findFirst).not.toHaveBeenCalled();
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
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(defaultGameDayList[5]);
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(defaultGameDayList[6]);
            const result = await gameDayService.getNext(6);
            expect(result).toEqual(defaultGameDayList[6]);
        });

        it('should return null for the last gameDayId 100', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(defaultGameDayList[99]);
            (prisma.gameDay.findFirst as Mock).mockResolvedValue(null);
            const result = await gameDayService.getNext(100);
            expect(result).toBeNull();
        });

        it('should return null when the gameDayId does not exist', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await gameDayService.getNext(9999);
            expect(result).toBeNull();
            expect(prisma.gameDay.findFirst).not.toHaveBeenCalled();
        });
    });

    describe('getAll year=0', () => {
        it('should treat year 0 as no year filter', async () => {
            const fixture = [defaultGameDay, { ...defaultGameDay, id: 2 }];
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameDayService.getAll({ year: 0 });
            expect(result).toHaveLength(2);
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.not.objectContaining({ year: expect.anything() as unknown }) as unknown,
                }),
            );
        });
    });

    describe('getGamesPlayed', () => {
        it('should return the correct number of games played for year 2021', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(52);
            const result = await gameDayService.getGamesPlayed(2021);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: true,
                    date: { gte: new Date(2021, 0, 1), lt: new Date(2022, 0, 1) },
                },
            });
            expect(result).toBe(52);
        });

        it('should return the correct number of games played for all years', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(100);
            const result = await gameDayService.getGamesPlayed(0);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: { game: true },
            });
            expect(result).toBe(100);
        });

        it('should return zero games played for year 9999', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(0);
            const result = await gameDayService.getGamesPlayed(9999);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: true,
                    date: { gte: new Date(9999, 0, 1), lt: new Date(10000, 0, 1) },
                },
            });
            expect(result).toBe(0);
        });

        it('should return the correct number of games played up to a specific game day id', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(50);
            const result = await gameDayService.getGamesPlayed(0, 50);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: true,
                    id: { lte: 50 },
                },
            });
            expect(result).toBe(50);
        });
    });

    describe('getGamesRemaining', () => {
        it('should return the correct number of games remaining for year 2021', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(0);
            const result = await gameDayService.getGamesRemaining(2021);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: true,
                    AND: [
                        {
                            date: {
                                gte: new Date(2021, 0, 1),
                                lt: new Date(2022, 0, 1),
                            },
                        },
                        {
                            date: {
                                gt: expect.any(Date) as unknown,
                            },
                        },
                    ],
                },
            });
            expect(result).toBe(0);
        });

        it('should return the correct number of games remaining for all years', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(0);
            const result = await gameDayService.getGamesRemaining(0);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: true,
                    AND: [
                        {},
                        {
                            date: {
                                gt: expect.any(Date) as unknown,
                            },
                        },
                    ],
                },
            });
            expect(result).toBe(0);
        });

        it('should return zero games remaining for year 9999', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValueOnce(0);
            const result = await gameDayService.getGamesRemaining(9999);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: true,
                    AND: [
                        {
                            date: {
                                gte: new Date(9999, 0, 1),
                                lt: new Date(10000, 0, 1),
                            },
                        },
                        {
                            date: {
                                gt: expect.any(Date) as unknown,
                            },
                        },
                    ],
                },
            });
            expect(result).toBe(0);
        });
    });

    describe('getGamesCancelled', () => {
        it('should count cancelled game days in a given year', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValue(3);
            const result = await gameDayService.getGamesCancelled(2021);
            expect(result).toBe(3);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: false,
                    mailSent: { not: null },
                    date: {
                        gte: new Date(2021, 0, 1),
                        lt: new Date(2022, 0, 1),
                    },
                },
            });
        });

        it('should count cancelled game days across all years when year is 0', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValue(5);
            const result = await gameDayService.getGamesCancelled(0);
            expect(result).toBe(5);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: false,
                    mailSent: { not: null },
                },
            });
        });

        it('should filter by game day id when untilGameDayId is provided', async () => {
            (prisma.gameDay.count as Mock).mockResolvedValue(2);
            const result = await gameDayService.getGamesCancelled(2021, 50);
            expect(result).toBe(2);
            expect(prisma.gameDay.count).toHaveBeenCalledWith({
                where: {
                    game: false,
                    mailSent: { not: null },
                    date: {
                        gte: new Date(2021, 0, 1),
                        lt: new Date(2022, 0, 1),
                    },
                    id: { lte: 50 },
                },
            });
        });
    });

    describe('getSeasonEnders', () => {
        it('should return the correct, complete list of last GameDays with a game for each year', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
                { _max: { id: 35 }, year: 2002 },
                { _max: { id: 94 }, year: 2003 },
                { _max: { id: 146 }, year: 2004 },
                { _max: { id: 199 }, year: 2005 },
                { _max: { id: 251 }, year: 2006 },
                { _max: { id: 303 }, year: 2007 },
                { _max: { id: 355 }, year: 2008 },
                { _max: { id: 407 }, year: 2009 },
                { _max: { id: 459 }, year: 2010 },
                { _max: { id: 511 }, year: 2011 },
                { _max: { id: 564 }, year: 2012 },
                { _max: { id: 616 }, year: 2013 },
                { _max: { id: 668 }, year: 2014 },
                { _max: { id: 720 }, year: 2015 },
                { _max: { id: 773 }, year: 2016 },
                { _max: { id: 824 }, year: 2017 },
                { _max: { id: 872 }, year: 2018 },
                { _max: { id: 928 }, year: 2019 },
                { _max: { id: 941 }, year: 2020 },
                { _max: { id: 1028 }, year: 2021 },
                { _max: { id: 1085 }, year: 2022 },
                { _max: { id: 1137 }, year: 2023 },
                { _max: { id: 1170 }, year: 2024 },
            ]);
            const result = await gameDayService.getSeasonEnders();
            expect(result).toHaveLength(23);
            expect(result[11]).toBe(616);
        });

        it('should return an empty array when no season enders exist', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([]);

            const result = await gameDayService.getSeasonEnders();

            expect(result).toEqual([]);
        });

        it('should return an empty array when groupBy returns undefined', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue(undefined);

            const result = await gameDayService.getSeasonEnders();

            expect(result).toEqual([]);
        });

        it('should pass the until date filter when provided', async () => {
            const until = new Date('2021-12-31');
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
                { _max: { id: 980 }, year: 2021 },
            ]);
            const result = await gameDayService.getSeasonEnders(until);
            expect(result).toEqual([980]);
            expect(prisma.gameDay.groupBy).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    game: true,
                    date: { lte: until },
                },
            }));
        });
    });

    describe('getAllYears', () => {
        it('should return the correct, complete list of a single year, 2021', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([{ year: 2021 }]);
            const result = await gameDayService.getAllYears({});
            expect(result).toHaveLength(1);
            expect(result[0]).toBe(2021);
        });

        it('should return the correct list of two values when includeAllTime is true', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([{ year: 2021 }]);
            const result = await gameDayService.getAllYears({ includeAllTime: true });
            expect(result).toHaveLength(2);
            expect(result).toContain(2021);
            expect(result).toContain(0);
        });

        it('should return an empty array when no GameDays exist', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([]);
            const result = await gameDayService.getAllYears({});
            expect(result).toHaveLength(0);
        });

        it('should return years in descending order when mostRecentFirst is true', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...defaultGameDay, year: 2023 },
                { ...defaultGameDay, year: 2021 },
                { ...defaultGameDay, year: 2022 },
            ]);
            const result = await gameDayService.getAllYears({ mostRecentFirst: true });
            expect(result).toEqual([2023, 2022, 2021]);
        });

        it('should prepend 0 when mostRecentFirst and includeAllTime are both true', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...defaultGameDay, year: 2022 },
                { ...defaultGameDay, year: 2021 },
            ]);
            const result = await gameDayService.getAllYears({ mostRecentFirst: true, includeAllTime: true });
            expect(result).toEqual([0, 2022, 2021]);
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
                ...defaultGameDay,
                pickerGamesHistory: 10,
            };
            (prisma.gameDay.create as Mock).mockResolvedValueOnce({ ...newGameDay, id: 101 });
            const result = await gameDayService.create(newGameDay);
            expect(prisma.gameDay.create).toHaveBeenCalledWith({
                data: {
                    ...newGameDay,
                    id: undefined,
                },
            });
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
            const gameDay: GameDayUpsertInput = { ...defaultGameDay, id: 1001, pickerGamesHistory: 10 };
            const expected = { ...defaultGameDay, pickerGamesHistory: 10, id: 101 };
            (prisma.gameDay.upsert as Mock).mockResolvedValueOnce(expected);
            const result = await gameDayService.upsert(gameDay);
            expect(result).toEqual(expected);
        });

        it('should update an existing GameDay where one with the id already existed', async () => {
            const updatedGameDay: GameDayUpsertInput = {
                ...defaultGameDay,
                id: 6,
                pickerGamesHistory: 10,
            };
            (prisma.gameDay.upsert as Mock).mockResolvedValueOnce(updatedGameDay);
            const result = await gameDayService.upsert(updatedGameDay);
            expect(result).toEqual(updatedGameDay);
        });
    });

    describe('update', () => {
        it('should update mutable fields while keeping id in the where clause', async () => {
            const expected = {
                ...defaultGameDayList[5],
                game: false,
                comment: 'Pitch frozen',
            };
            (prisma.gameDay.update as Mock).mockResolvedValueOnce(expected);
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
            expect(result).toEqual(expected);
        });
    });

    describe('markMailSent', () => {
        it('should set mailSent to the provided date', async () => {
            const mailSent = new Date('2024-02-01T10:00:00Z');
            (prisma.gameDay.update as Mock).mockResolvedValueOnce({
                ...defaultGameDayList[5],
                mailSent,
            });

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
                (prisma.gameDay.update as Mock).mockResolvedValueOnce({
                    ...defaultGameDayList[6],
                    mailSent: now,
                });
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
            (prisma.gameDay.update as Mock).mockRejectedValueOnce(new Error('gameDay does not exist'));
            await expect(gameDayService.markMailSent(-1)).rejects.toThrow('gameDay does not exist');
            expect(prisma.gameDay.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('getForMonth', () => {
        it('should return game days for the specified month', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                [defaultGameDayList[0], defaultGameDayList[1]],
            );
            const result = await gameDayService.getForMonth(2021, 1);
            expect(result).toHaveLength(2);
            expect(prisma.gameDay.findMany).toHaveBeenCalledWith({
                where: {
                    date: {
                        gte: new Date(2021, 0, 1),
                        lt: new Date(2021, 1, 1),
                    },
                },
                orderBy: { date: 'asc' },
            });
        });

        it('should return an empty array when no game days exist for the month', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([]);
            const result = await gameDayService.getForMonth(2025, 6);
            expect(result).toHaveLength(0);
        });
    });

    describe('delete', () => {
        it('should delete an existing GameDay', async () => {
            (prisma.gameDay.delete as Mock).mockResolvedValueOnce(defaultGameDayList[5]);
            await gameDayService.delete(6);
            expect(prisma.gameDay.delete).toHaveBeenCalledWith({ where: { id: 6 } });
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
            expect(prisma.gameDay.delete).toHaveBeenCalledWith({ where: { id: 107 } });
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.gameDay.delete as Mock).mockRejectedValueOnce(new Error('db exploded'));
            await expect(gameDayService.delete(6)).rejects.toThrow('db exploded');
        });
    });

    describe('deleteAll', () => {
        it('should delete all GameDays', async () => {
            (prisma.gameDay.deleteMany as Mock).mockResolvedValueOnce({ count: 0 });
            await gameDayService.deleteAll();
            expect(prisma.gameDay.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

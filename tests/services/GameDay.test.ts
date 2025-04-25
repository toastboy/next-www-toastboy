import prisma from 'lib/prisma';
import { defaultGameDay } from 'mocks/data/gameday';
import { GameDay } from 'prisma/generated/prisma/client';
import gameDayService from 'services/GameDay';

jest.mock('lib/prisma', () => ({
    gameDay: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        groupBy: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const gameDayList: GameDay[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultGameDay,
    id: index + 1,
}));

describe('GameDayService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.gameDay.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                id: number
            }
        }) => {
            const gameDay = gameDayList.find((gameDay) => gameDay.id === args.where.id);
            return Promise.resolve(gameDay ? gameDay : null);
        });

        (prisma.gameDay.findMany as jest.Mock).mockImplementation((args: {
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
            const gameDays = args.where ? gameDayList.filter((gameDay) =>
                (args.where.game ? gameDay.game === args.where.game : true) &&
                (args.where.id ? gameDay.id <= args.where.id.lte : true) &&
                (args.where.date ? gameDay.date >= args.where.date.gte : true) &&
                (args.where.date ? gameDay.date < args.where.date.lt : true),
            ) : gameDayList;
            return Promise.resolve(gameDays ? gameDays : null);
        });

        (prisma.gameDay.count as jest.Mock).mockImplementation((args: {
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
            const gameDays = args.where ? gameDayList.filter((gameDay) =>
                (args.where.game ? gameDay.game === args.where.game : true) &&
                (args.where.id ? gameDay.id <= args.where.id.lte : true) &&
                (args.where.date ? gameDay.date >= args.where.date.gte : true) &&
                (args.where.date ? gameDay.date < args.where.date.lt : true) &&
                (args.where.AND && args.where.AND[0].date ? gameDay.date >= args.where.AND[0].date.gte : true) &&
                (args.where.AND && args.where.AND[0].date ? gameDay.date < args.where.AND[0].date.lt : true) &&
                (args.where.AND && args.where.AND[1].date ? gameDay.date > args.where.AND[1].date.gt : true),
            ) : gameDayList;
            return Promise.resolve(gameDays ? gameDays.length : null);
        });

        (prisma.gameDay.create as jest.Mock).mockImplementation((args: { data: GameDay }) => {
            const gameDay = gameDayList.find((gameDay) => gameDay.id === args.data.id);

            if (gameDay) {
                return Promise.reject(new Error('gameDay already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.gameDay.upsert as jest.Mock).mockImplementation((args: {
            where: { id: number },
            update: GameDay,
            create: GameDay,
        }) => {
            const gameDay = gameDayList.find((gameDay) => gameDay.id === args.where.id);

            if (gameDay) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.gameDay.delete as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameDay = gameDayList.find((gameDay) => gameDay.id === args.where.id);
            return Promise.resolve(gameDay ? gameDay : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct GameDay with id 6', async () => {
            const result = await gameDayService.get(6);
            expect(result).toEqual({
                ...defaultGameDay,
                id: 6,
            } as GameDay);
        });

        it('should return null for id 107', async () => {
            const result = await gameDayService.get(107);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return the correct, complete list of 100 GameDays', async () => {
            const result = await gameDayService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].id).toEqual(12);
        });
    });

    describe('getByDate', () => {
        it('should retrieve the correct GameDay with date 2021-01-03', async () => {
            (prisma.gameDay.findFirst as jest.Mock).mockResolvedValue(defaultGameDay);
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
            (prisma.gameDay.findFirst as jest.Mock).mockResolvedValue(defaultGameDay);
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
            (prisma.gameDay.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await gameDayService.getCurrent();
            expect(result).toBeNull();
        });
    });

    describe('getGamesPlayed', () => {
        it('should return the correct number of games played for year 2021', async () => {
            const result = await gameDayService.getGamesPlayed(2021);
            expect(result).toEqual(100);
        });

        it('should return the correct number of games played for all years', async () => {
            const result = await gameDayService.getGamesPlayed(0);
            expect(result).toEqual(100);
        });

        it('should return zero games played for year 9999', async () => {
            const result = await gameDayService.getGamesPlayed(9999);
            expect(result).toEqual(0);
        });
    });

    describe('getGamesRemaining', () => {
        it('should return the correct number of games remaining for year 2021', async () => {
            const result = await gameDayService.getGamesRemaining(2021);
            expect(result).toEqual(0);
        });

        it('should return the correct number of games remaining for all years', async () => {
            const result = await gameDayService.getGamesRemaining(0);
            expect(result).toEqual(0);
        });

        it('should return zero games remaining for year 9999', async () => {
            const result = await gameDayService.getGamesRemaining(9999);
            expect(result).toEqual(0);
        });
    });

    describe('getSeasonEnders', () => {
        it('should return the correct, complete list of last GameDays with a game for each year', async () => {
            (prisma.gameDay.groupBy as jest.Mock).mockResolvedValue([
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
            expect(result.length).toEqual(23);
            expect(result[11]).toEqual(616);
        });
    });

    describe('getAllYears', () => {
        it('should return the correct, complete list of a single year, 2021', async () => {
            const result = await gameDayService.getAllYears();
            if (result) {
                expect(result.length).toEqual(1);
                expect(result[0]).toEqual(2021);
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('getYear', () => {
        it('should return the year when called with a year that has games played or to be played', async () => {
            (prisma.gameDay.findFirst as jest.Mock).mockResolvedValue(defaultGameDay);
            const result = await gameDayService.getYear(2021);
            if (result) {
                expect(result).toEqual(2021);
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return null when called with a year that has no games played or to be played', async () => {
            (prisma.gameDay.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await gameDayService.getYear(1966);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a GameDay', async () => {
            const newGameDay: GameDay = {
                ...defaultGameDay,
                id: 106,
            };
            const result = await gameDayService.create(newGameDay);
            expect(result).toEqual(newGameDay);
        });

        it('should refuse to create a GameDay with invalid data', async () => {
            await expect(gameDayService.create({
                ...defaultGameDay,
                id: -1,
            })).rejects.toThrow();
            await expect(gameDayService.create({
                ...defaultGameDay,
                pickerGamesHistory: 7,
            })).rejects.toThrow();
        });

        it('should refuse to create a GameDay that has the same id as an existing one', async () => {
            await expect(gameDayService.create({
                ...defaultGameDay,
                id: 6,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a GameDay', async () => {
            const result = await gameDayService.upsert(defaultGameDay);
            expect(result).toEqual(defaultGameDay);
        });

        it('should update an existing GameDay where one with the id already existed', async () => {
            const updatedGameDay: GameDay = {
                ...defaultGameDay,
                id: 6,
            };
            const result = await gameDayService.upsert(updatedGameDay);
            expect(result).toEqual(updatedGameDay);
        });
    });

    describe('delete', () => {
        it('should delete an existing GameDay', async () => {
            await gameDayService.delete(6);
        });

        it('should silently return when asked to delete a GameDay that does not exist', async () => {
            await gameDayService.delete(107);
        });
    });

    describe('deleteAll', () => {
        it('should delete all GameDays', async () => {
            await gameDayService.deleteAll();
        });
    });
});

import prisma from 'lib/prisma';
import {
    PlayerResponseSchema,
} from 'prisma/generated/schemas';
import {
    OutcomeType,
} from 'prisma/generated/schemas/models/Outcome.schema';
import outcomeService from 'services/Outcome';

jest.mock('lib/prisma', () => ({
    outcome: {
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

const defaultOutcome: OutcomeType = {
    id: 1,
    gameDayId: 1,
    playerId: 12,
    response: 'Yes',
    responseInterval: 1000,
    points: 3,
    team: 'A',
    comment: 'Test comment',
    pub: 1,
    paid: false,
    goalie: false,
};

const outcomeList: OutcomeType[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultOutcome,
    playerId: index % 10 + 1,
    gameDayId: Math.floor(index / 10 + 1),
}));

describe('OutcomeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.outcome.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = outcomeList.find((outcome) =>
                outcome.gameDayId === args.where.gameDayId_playerId.gameDayId &&
                outcome.playerId === args.where.gameDayId_playerId.playerId,
            );
            return Promise.resolve(outcome ?? null);
        });

        (prisma.outcome.findMany as jest.Mock).mockImplementation((args: {
            where: {
                playerId: number,
                gameDayId: number
            },
            take: number,
            orderBy: { responseInterval: 'desc' }
        }) => {
            return Promise.resolve(outcomeList.filter((outcome) =>
                outcome.playerId === args.where.playerId &&
                outcome.gameDayId < args.where.gameDayId).slice(0, args.take),
            );
        });

        (prisma.outcome.count as jest.Mock).mockImplementation((args: {
            where: {
                playerId: number,
                gameDay: {
                    date: {
                        gte: Date,
                        lt: Date
                    },
                    id?: {
                        lte: number
                    }
                }
            }
        }) => {
            return Promise.resolve(outcomeList.filter((outcome) =>
                outcome.playerId === args.where.playerId &&
                (args.where.gameDay.id ? outcome.gameDayId <= args.where.gameDay.id.lte : true)).length);
        });

        (prisma.outcome.create as jest.Mock).mockImplementation((args: { data: OutcomeType }) => {
            const outcome = outcomeList.find((outcome) =>
                outcome.gameDayId === args.data.gameDayId &&
                outcome.playerId === args.data.playerId,
            );

            if (outcome) {
                return Promise.reject(new Error('Outcome already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.outcome.upsert as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            },
            update: OutcomeType,
            create: OutcomeType,
        }) => {
            const outcome = outcomeList.find((outcome) =>
                outcome.gameDayId === args.where.gameDayId_playerId.gameDayId &&
                outcome.playerId === args.where.gameDayId_playerId.playerId,
            );

            if (outcome) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.outcome.delete as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = outcomeList.find((outcome) =>
                outcome.gameDayId === args.where.gameDayId_playerId.gameDayId &&
                outcome.playerId === args.where.gameDayId_playerId.playerId,
            );
            return Promise.resolve(outcome ?? null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct Outcome for GameDay 1, Player 1', async () => {
            const result = await outcomeService.get(1, 1);
            expect(result).toEqual({
                ...defaultOutcome,
                gameDayId: 1,
                playerId: 1,
            } as OutcomeType);
        });

        it('should return null for GameDay 7, Player 16', async () => {
            const result = await outcomeService.get(7, 16);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(outcomeList);
            });
        });

        it('should return the correct, complete list of 100 Outcomes', async () => {
            const result = await outcomeService.getAll();
            if (result) {
                expect(result).toHaveLength(100);
                expect(result[11].playerId).toBe(2);
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('getLastPlayed', () => {
        it('should return the correct last played GameDay ID', async () => {
            (prisma.outcome.findFirst as jest.Mock).mockResolvedValueOnce(defaultOutcome);
            const result = await outcomeService.getLastPlayed();
            expect(result).toEqual(defaultOutcome);
            expect(prisma.outcome.findFirst).toHaveBeenCalledWith({
                where: {
                    points: {
                        not: null,
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
            });
        });
    });

    describe('getAllForYear', () => {
        it('should return the correct, complete list of 100 Outcomes', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce(outcomeList);

            let result = await outcomeService.getAllForYear(2021);
            expect(result).toHaveLength(100);
            expect(result[11].playerId).toBe(2);

            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce(outcomeList.filter((outcome) => outcome.gameDayId <= 7));

            result = await outcomeService.getAllForYear(2021, 7);
            expect(result).toHaveLength(70);
            expect(result[11].playerId).toBe(2);

            result = await outcomeService.getAllForYear(0);
            expect(result).toHaveLength(0);
        });
    });

    describe('getTurnout + getTurnoutByYear', () => {
        const mockResponseCounts = Array.from({ length: 10 }, (_, index) => ({
            _count: {
                response: 12 - (index % 3),
            },
            response: "Yes",
            gameDayId: index + 1,
        }));
        const mockGameDays = Array.from({ length: 10 }, (_, index) => ({
            id: index + 1,
            year: 2021,
            date: new Date('2021-01-03'),
            game: (index != 6),
            mailSent: new Date('2021-01-01'),
            comment: 'I heart footy',
            bibs: 'A',
            pickerGamesHistory: 10,
        }));

        beforeEach(() => {
            (prisma.outcome.groupBy as jest.Mock).mockResolvedValue(mockResponseCounts);
            (prisma.gameDay.findMany as jest.Mock).mockResolvedValue(mockGameDays);
            (prisma.gameDay.findUnique as jest.Mock).mockResolvedValue(mockGameDays[0]);
        });

        it('should retrieve the turnout for a specific game day', async () => {
            const result = await outcomeService.getTurnout(1);
            expect(result).toEqual([{
                ...mockGameDays[0],
                dunno: 0,
                excused: 0,
                flaked: 0,
                injured: 0,
                no: 0,
                yes: 12,
                responses: 12,
                players: 0,
                cancelled: false,
            }]);
        });

        it('should retrieve the turnout for all game days', async () => {
            const result = await outcomeService.getTurnout();
            expect(result).toEqual(Array.from({ length: 10 }, (_, index) => ({
                ...mockGameDays[index],
                dunno: 0,
                excused: 0,
                flaked: 0,
                injured: 0,
                no: 0,
                yes: 12 - (index % 3),
                responses: 12 - (index % 3),
                players: 0,
                cancelled: expect.any(Boolean),
            })));
        });

        it('should return the correct turnout summary for all years', async () => {
            const result = await outcomeService.getTurnoutByYear();
            expect(result).toEqual([{
                year: 2021,
                gameDays: 10,
                gamesScheduled: 10,
                gamesInitiated: 10,
                gamesPlayed: 9,
                gamesCancelled: 1,
                responses: 111,
                yesses: 111,
                players: 0,
                responsesPerGameInitiated: 11.1,
                yessesPerGameInitiated: 11.1,
                playersPerGamePlayed: 0,
            }]);
        });
    });

    describe('getByGameDay', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { gameDayId: number } }) => {
                return Promise.resolve(outcomeList.filter((outcome) => outcome.gameDayId === args.where.gameDayId));
            });
        });

        it('should retrieve the correct Outcomes for GameDay id 1', async () => {
            const result = await outcomeService.getByGameDay(1);
            if (result) {
                expect(result).toHaveLength(10);
                for (const outcomeResult of result) {
                    expect(outcomeResult).toEqual({
                        ...defaultOutcome,
                        playerId: expect.any(Number),
                        gameDayId: 1,
                    } as OutcomeType);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return an empty list when retrieving outcomes for GameDay id 101', async () => {
            const result = await outcomeService.getByGameDay(101);
            expect(result).toEqual([]);
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(outcomeList.filter((outcome) => outcome.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct Outcomes for Player ID 1', async () => {
            const result = await outcomeService.getByPlayer(1);
            expect(result).toHaveLength(10);
            for (const outcomeResult of result) {
                expect(outcomeResult).toEqual({
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: expect.any(Number),
                } as OutcomeType);
            }
        });

        it('should return an empty list when retrieving Outcomes for Player id 11', async () => {
            const result = await outcomeService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getGamesPlayedByPlayer', () => {
        it('should retrieve the correct number of games played for Player ID 1, year 2021', async () => {
            const result = await outcomeService.getGamesPlayedByPlayer(1, 2021);
            expect(result).toBe(10);
        });
        it('should retrieve the correct number of games played for Player ID 1, year 0', async () => {
            const result = await outcomeService.getGamesPlayedByPlayer(1, 0);
            expect(result).toBe(10);
        });
        it('should retrieve the correct number of games played for Player ID 1, year 0, untilGameDayId 8', async () => {
            const result = await outcomeService.getGamesPlayedByPlayer(1, 0, 8);
            expect(result).toBe(8);
        });

        it('should return 0 for Player ID 11', async () => {
            const result = await outcomeService.getGamesPlayedByPlayer(11, 2021);
            expect(result).toBe(0);
        });
    });

    describe('getLatestGamePlayedByYear', () => {
        const defaultGameDay = {
            id: 1,
            game: true,
            mailSent: null,
            comment: null,
            bibs: null,
            pickerGamesHistory: 10,
        };

        it('should retrieve the correct latest game played for year 2021', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValue([{
                ...defaultOutcome,
                gameDayId: 1,
                points: 0,
                gameDay: {
                    ...defaultGameDay,
                    id: 1,
                    date: new Date('2021-01-01'),
                },
            }]);
            const result = await outcomeService.getLatestGamePlayedByYear(2021);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    points: {
                        not: null,
                    },
                    gameDay: {
                        date: {
                            gte: new Date('2021-01-01'),
                            lt: new Date('2022-01-01'),
                        },
                    },
                },
                take: 1,
                orderBy: {
                    gameDayId: 'desc',
                },
            });
            expect(result).toBe(1);
        });

        it('should retrieve the correct latest game played for all time', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValue([{
                ...defaultOutcome,
                gameDayId: 3,
                points: 0,
                gameDay: {
                    ...defaultGameDay,
                    id: 3,
                    date: new Date('2023-01-01'),
                },
            }]);
            const result = await outcomeService.getLatestGamePlayedByYear(0);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    points: {
                        not: null,
                    },
                },
                take: 1,
                orderBy: {
                    gameDayId: 'desc',
                },
            });
            expect(result).toBe(3);
        });

        it('should return null for year 9999', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValue([]);
            const result = await outcomeService.getLatestGamePlayedByYear(9999);
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create an Outcome', async () => {
            const result = await outcomeService.create(defaultOutcome);
            expect(result).toEqual(defaultOutcome);
        });

        it('should refuse to create an Outcome with invalid data', async () => {
            await expect(outcomeService.create({
                ...defaultOutcome,
                response: 'Wibble',
            })).rejects.toThrow();
            await expect(outcomeService.create({
                ...defaultOutcome,
                responseInterval: -1,
            })).rejects.toThrow();
            await expect(outcomeService.create({
                ...defaultOutcome,
                points: 2,
            })).rejects.toThrow();
            await expect(outcomeService.create({
                ...defaultOutcome,
                team: 'X',
            })).rejects.toThrow();
            await expect(outcomeService.create({
                ...defaultOutcome,
                playerId: -1,
            })).rejects.toThrow();
            await expect(outcomeService.create({
                ...defaultOutcome,
                gameDayId: -1,
            })).rejects.toThrow();
        });

        it('should refuse to create an Outcome that has the same GameDay ID and Player ID as an existing one', async () => {
            await expect(outcomeService.create({
                ...defaultOutcome,
                playerId: 1,
                gameDayId: 1,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create an outcome where the combination of GameDay ID and Player ID did not exist', async () => {
            const result = await outcomeService.upsert(defaultOutcome);
            expect(result).toEqual(defaultOutcome);
        });

        it('should update an existing Outcome where the combination of GameDay ID and Player ID already existed', async () => {
            const updatedOutcome = {
                ...defaultOutcome,
                playerId: 1,
                gameDayId: 1,
                response: PlayerResponseSchema.parse('No'),
                comment: 'Updated comment',
            };
            const result = await outcomeService.upsert(updatedOutcome);
            expect(result).toEqual(updatedOutcome);
        });
    });

    describe('delete', () => {
        it('should delete an existing Outcome', async () => {
            await outcomeService.delete(1, 1);
        });

        it('should silently return when asked to delete an Outcome that does not exist', async () => {
            await outcomeService.delete(7, 16);
        });
    });

    describe('deleteAll', () => {
        it('should delete all Outcomes', async () => {
            await outcomeService.deleteAll();
        });
    });
});

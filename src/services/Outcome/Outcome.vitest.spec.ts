import prisma from 'prisma/prisma';
import {
    PlayerResponseSchema,
} from 'prisma/zod/schemas';
import {
    OutcomeType,
} from 'prisma/zod/schemas/models/Outcome.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import outcomeService from '@/services/Outcome';
import {
    createMockOutcome,
    defaultOutcome,
    defaultOutcomeList,
} from '@/tests/mocks/data/outcome';
import { createMockPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

describe('OutcomeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (prisma.outcome.findUnique as Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = defaultOutcomeList.find((outcome) =>
                outcome.gameDayId === args.where.gameDayId_playerId.gameDayId &&
                outcome.playerId === args.where.gameDayId_playerId.playerId,
            );
            return Promise.resolve(outcome ?? null);
        });

        (prisma.outcome.findMany as Mock).mockImplementation((args: {
            where: {
                playerId: number,
                gameDayId: number
            },
            take: number,
            orderBy: { responseInterval: 'desc' }
        }) => {
            return Promise.resolve(defaultOutcomeList.filter((outcome) =>
                outcome.playerId === args.where.playerId &&
                outcome.gameDayId < args.where.gameDayId).slice(0, args.take),
            );
        });

        (prisma.outcome.count as Mock).mockImplementation((args: {
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
            return Promise.resolve(defaultOutcomeList.filter((outcome) =>
                outcome.playerId === args.where.playerId &&
                (args.where.gameDay.id ? outcome.gameDayId <= args.where.gameDay.id.lte : true)).length);
        });

        (prisma.outcome.create as Mock).mockImplementation((args: { data: OutcomeType }) => {
            const outcome = defaultOutcomeList.find((outcome) =>
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

        (prisma.outcome.upsert as Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            },
            update: OutcomeType,
            create: OutcomeType,
        }) => {
            const outcome = defaultOutcomeList.find((outcome) =>
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

        (prisma.outcome.delete as Mock).mockImplementation((args: {
            where: {
                gameDayId_playerId: {
                    gameDayId: number,
                    playerId: number,
                }
            }
        }) => {
            const outcome = defaultOutcomeList.find((outcome) =>
                outcome.gameDayId === args.where.gameDayId_playerId.gameDayId &&
                outcome.playerId === args.where.gameDayId_playerId.playerId,
            );
            return Promise.resolve(outcome ?? null);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
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
            (prisma.outcome.findMany as Mock).mockImplementation(() => {
                return Promise.resolve(defaultOutcomeList);
            });
        });

        it('should return the correct, complete list of 100 Outcomes', async () => {
            const result = await outcomeService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].playerId).toBe(2);
        });
    });

    describe('getLastPlayed', () => {
        it('should return the correct last played GameDay ID', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValueOnce(defaultOutcome);
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
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(defaultOutcomeList);

            let result = await outcomeService.getAllForYear(2021);
            expect(result).toHaveLength(100);
            expect(result[11].playerId).toBe(2);

            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(defaultOutcomeList.filter((outcome) => outcome.gameDayId <= 7));

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
            (prisma.outcome.groupBy as Mock).mockResolvedValue(mockResponseCounts);
            (prisma.gameDay.findMany as Mock).mockResolvedValue(mockGameDays);
            (prisma.gameDay.findUnique as Mock).mockResolvedValue(mockGameDays[0]);
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
            expect(result).toHaveLength(10);
            for (const [index, turnout] of result.entries()) {
                expect(turnout).toMatchObject({
                    ...mockGameDays[index],
                    dunno: 0,
                    excused: 0,
                    flaked: 0,
                    injured: 0,
                    no: 0,
                    yes: 12 - (index % 3),
                    responses: 12 - (index % 3),
                    players: 0,
                });
                expect(typeof turnout.cancelled).toBe('boolean');
            }
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
            (prisma.outcome.findMany as Mock).mockImplementation((args: { where: { gameDayId: number } }) => {
                return Promise.resolve(defaultOutcomeList.filter((outcome) => outcome.gameDayId === args.where.gameDayId));
            });
        });

        it('should retrieve the correct Outcomes for GameDay id 1', async () => {
            const result = await outcomeService.getByGameDay(1);
            const expected = defaultOutcomeList.filter((outcome) => outcome.gameDayId === 1);
            expect(result).toHaveLength(expected.length);
            expect(result).toEqual(expected);
        });

        it('should return an empty list when retrieving outcomes for GameDay id 101', async () => {
            const result = await outcomeService.getByGameDay(101);
            expect(result).toEqual([]);
        });
    });

    describe('getAdminByGameDay', () => {
        it('should include active players without outcomes as response none rows', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockPlayer({ id: 1, name: 'Alex Keeper', finished: null }),
                    outcomes: [
                        createMockOutcome({
                            id: 101,
                            gameDayId: 25,
                            playerId: 1,
                            response: PlayerResponseSchema.enum.Yes,
                        }),
                    ],
                },
                {
                    ...createMockPlayer({ id: 2, name: 'Britt Winger', finished: null }),
                    outcomes: [],
                },
            ]);

            const result = await outcomeService.getAdminByGameDay(25);

            expect(prisma.player.findMany).toHaveBeenCalledWith({
                where: {
                    finished: null,
                },
                orderBy: [
                    { name: 'asc' },
                    { id: 'asc' },
                ],
                include: {
                    outcomes: {
                        where: {
                            gameDayId: 25,
                        },
                        take: 1,
                    },
                },
            });
            expect(result).toEqual([
                expect.objectContaining({
                    id: 101,
                    playerId: 1,
                    gameDayId: 25,
                    response: PlayerResponseSchema.enum.Yes,
                }),
                expect.objectContaining({
                    id: -2,
                    playerId: 2,
                    gameDayId: 25,
                    response: null,
                }),
            ]);
        });

        it('should throw for invalid gameDayId', async () => {
            await expect(outcomeService.getAdminByGameDay(0)).rejects.toThrow();
            expect(prisma.player.findMany).not.toHaveBeenCalled();
        });
    });

    describe('getTeamPlayersByGameDay', () => {
        it('should return team players with outcomes and form history', async () => {
            const formHistory = 2;
            const playerOneForm = defaultPlayerFormList
                .filter((form) => form.playerId === 1 && form.gameDayId < 10)
                .slice(0, formHistory);
            const mockOutcomesWithPlayers = [
                {
                    ...createMockOutcome({ id: 201, gameDayId: 10, playerId: 1, team: 'A' }),
                    player: {
                        ...createMockPlayer({ id: 1, name: 'Player One' }),
                        outcomes: playerOneForm,
                    },
                },
                {
                    ...createMockOutcome({ id: 202, gameDayId: 10, playerId: 2, team: 'A', goalie: true }),
                    player: {
                        ...createMockPlayer({ id: 2, name: 'Player Two' }),
                        outcomes: [],
                    },
                },
            ];

            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(mockOutcomesWithPlayers);

            const result = await outcomeService.getTeamPlayersByGameDay(10, 'A', formHistory);

            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    gameDayId: 10,
                    team: 'A',
                },
                include: {
                    player: {
                        include: {
                            outcomes: {
                                where: {
                                    gameDayId: {
                                        lt: 10,
                                    },
                                    points: {
                                        not: null,
                                    },
                                },
                                orderBy: {
                                    gameDayId: 'desc',
                                },
                                take: formHistory,
                                include: {
                                    gameDay: true,
                                },
                            },
                        },
                    },
                },
            });
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: 1,
                outcome: {
                    playerId: 1,
                    gameDayId: 10,
                    team: 'A',
                },
                form: playerOneForm,
            });
            expect(result[1].form).toEqual([]);
            expect(result[1].outcome.goalie).toBe(true);
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(defaultOutcomeList.filter((outcome) => outcome.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct Outcomes for Player ID 1', async () => {
            const result = await outcomeService.getByPlayer(1);
            const expected = defaultOutcomeList.filter((outcome) => outcome.playerId === 1);
            expect(result).toHaveLength(expected.length);
            expect(result).toEqual(expected);
        });

        it('should return an empty list when retrieving Outcomes for Player id 11', async () => {
            const result = await outcomeService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getRecentGamePoints', () => {
        it('should retrieve recent points using the legacy stored procedure filters', async () => {
            const recentPointsRows = [
                { points: 3 },
                { points: 1 },
                { points: 0 },
                { points: null },
            ];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(recentPointsRows);

            const result = await outcomeService.getRecentGamePoints(25, 7);

            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    gameDayId: {
                        lt: 25,
                    },
                    playerId: 7,
                    team: {
                        not: null,
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
                take: 10,
                select: {
                    points: true,
                },
            });
            expect(result).toEqual([3, 1, 0, null]);
        });

        it('should throw for invalid input values', async () => {
            await expect(outcomeService.getRecentGamePoints(0, 1)).rejects.toThrow();
            await expect(outcomeService.getRecentGamePoints(1, 0)).rejects.toThrow();
            expect(prisma.outcome.findMany).not.toHaveBeenCalled();
        });
    });

    describe('getRecentAverage', () => {
        it('should calculate average from the requested history size', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { points: 3 },
                { points: 1 },
                { points: 0 },
                { points: 3 },
            ]);

            const result = await outcomeService.getRecentAverage(25, 7, 3);

            expect(result).toBeCloseTo(4 / 3, 10);
        });

        it('should credit 1.45 points for missing recent games', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { points: 3 },
                { points: 0 },
            ]);

            const result = await outcomeService.getRecentAverage(25, 7, 5);

            expect(result).toBeCloseTo(1.47, 10);
        });

        it('should treat null points as zero while still counting the game', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { points: null },
                { points: 3 },
            ]);

            const result = await outcomeService.getRecentAverage(25, 7, 3);

            expect(result).toBeCloseTo(4.45 / 3, 10);
        });

        it('should throw for invalid history', async () => {
            await expect(outcomeService.getRecentAverage(1, 1, 0)).rejects.toThrow();
            expect(prisma.outcome.findMany).not.toHaveBeenCalled();
        });
    });

    describe('getPlayerGamesPlayed', () => {
        it('should count games where the player has a team assigned', async () => {
            (prisma.outcome.count as Mock).mockResolvedValueOnce(14);

            const result = await outcomeService.getPlayerGamesPlayed(7);

            expect(prisma.outcome.count).toHaveBeenCalledWith({
                where: {
                    playerId: 7,
                    team: {
                        not: null,
                    },
                },
            });
            expect(result).toBe(14);
        });

        it('should throw for invalid player id', async () => {
            await expect(outcomeService.getPlayerGamesPlayed(0)).rejects.toThrow();
            expect(prisma.outcome.count).not.toHaveBeenCalled();
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
            (prisma.outcome.findMany as Mock).mockResolvedValue([{
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
            (prisma.outcome.findMany as Mock).mockResolvedValue([{
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
            (prisma.outcome.findMany as Mock).mockResolvedValue([]);
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
            expect(prisma.outcome.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete an Outcome that does not exist', async () => {
            await outcomeService.delete(7, 16);
            expect(prisma.outcome.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all Outcomes', async () => {
            await outcomeService.deleteAll();
            expect(prisma.outcome.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

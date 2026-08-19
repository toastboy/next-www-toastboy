import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { PlayerResponseSchema } from 'prisma/zod/schemas';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import outcomeService from '@/services/Outcome';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome, defaultOutcome } from '@/tests/mocks/data/outcome';
import { createMockPlayer } from '@/tests/mocks/data/player';
import type { OutcomeWriteInput } from '@/types/OutcomeStrictSchema';

const defaultOutcomeInput: OutcomeWriteInput = {
    gameDayId: defaultOutcome.gameDayId,
    playerId: defaultOutcome.playerId,
    response: defaultOutcome.response,
    responseInterval: defaultOutcome.responseInterval,
    team: defaultOutcome.team,
    comment: defaultOutcome.comment,
    pub: defaultOutcome.pub,
    goalie: defaultOutcome.goalie,
};

describe('OutcomeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct Outcome for GameDay 1, Player 1', async () => {
            (prisma.outcome.findUnique as Mock).mockResolvedValueOnce({
                ...defaultOutcome,
                gameDayId: 1,
                playerId: 1,
            });
            const result = await outcomeService.get(1, 1);
            expect(prisma.outcome.findUnique).toHaveBeenCalledWith({
                where: { gameDayId_playerId: { gameDayId: 1, playerId: 1 } },
            });
            expect(result).toEqual({
                ...defaultOutcome,
                gameDayId: 1,
                playerId: 1,
            });
        });

        it('should return null for GameDay 7, Player 16', async () => {
            (prisma.outcome.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await outcomeService.get(7, 16);
            expect(prisma.outcome.findUnique).toHaveBeenCalledWith({
                where: { gameDayId_playerId: { gameDayId: 7, playerId: 16 } },
            });
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all Outcomes', async () => {
            const fixture = [
                defaultOutcome,
                { ...defaultOutcome, gameDayId: 2, playerId: 2 },
            ];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await outcomeService.getAll();
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({});
            expect(result).toEqual(fixture);
        });
    });

    describe('getLastPlayed', () => {
        it('should return the correct last played GameDay ID', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValueOnce(
                defaultOutcome,
            );
            const result = await outcomeService.getLastPlayed();
            expect(result).toEqual(defaultOutcome);
            expect(prisma.outcome.findFirst).toHaveBeenCalledWith({
                where: {
                    team: { not: null },
                    gameDay: { status: { in: ['AWin', 'BWin', 'Draw'] } },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
            });
        });
    });

    describe('getAllForYear', () => {
        it('should return outcomes for a specific year', async () => {
            const fixture = [
                defaultOutcome,
                { ...defaultOutcome, gameDayId: 2, playerId: 2 },
            ];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await outcomeService.getAllForYear(2021);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    gameDay: {
                        date: {
                            gte: new Date(Date.UTC(2021, 0, 1)),
                            lt: new Date(Date.UTC(2022, 0, 1)),
                        },
                        id: {},
                    },
                },
                orderBy: { gameDayId: 'desc' },
            });
            expect(result).toEqual(fixture);
        });

        it('should return outcomes for a year up to a specific game day', async () => {
            const fixture = [defaultOutcome];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await outcomeService.getAllForYear(2021, 7);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    gameDay: {
                        date: {
                            gte: new Date(Date.UTC(2021, 0, 1)),
                            lt: new Date(Date.UTC(2022, 0, 1)),
                        },
                        id: { lte: 7 },
                    },
                },
                orderBy: { gameDayId: 'desc' },
            });
            expect(result).toEqual(fixture);
        });

        it('should return all outcomes when year is 0', async () => {
            const fixture = [defaultOutcome];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await outcomeService.getAllForYear(0);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    gameDay: {
                        date: {},
                        id: {},
                    },
                },
                orderBy: { gameDayId: 'desc' },
            });
            expect(result).toEqual(fixture);
        });
    });

    describe('getTurnout + getTurnoutByYear', () => {
        const mockResponseCounts = Array.from({ length: 10 }, (_, index) => ({
            _count: {
                response: 12 - (index % 3),
            },
            response: 'Yes',
            gameDayId: index + 1,
        }));
        const mockGameDays = Array.from({ length: 10 }, (_, index) => ({
            id: index + 1,
            year: 2021,
            date: new Date('2021-01-03'),
            status: index != 6 ? 'Scheduled' : 'NoGame',
            mailSent: new Date('2021-01-01'),
            comment: 'I heart footy',
            bibs: 'A',
            pickerGamesHistory: 10,
        }));

        beforeEach(() => {
            (prisma.outcome.groupBy as Mock).mockResolvedValue(
                mockResponseCounts,
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue(mockGameDays);
            (prisma.gameDay.findUnique as Mock).mockResolvedValue(
                mockGameDays[0],
            );
        });

        it('should retrieve the turnout for a specific game day', async () => {
            const result = await outcomeService.getTurnout(1);
            expect(result).toEqual([
                {
                    ...mockGameDays[0],
                    game: true,
                    dunno: 0,
                    excused: 0,
                    flaked: 0,
                    injured: 0,
                    no: 0,
                    yes: 12,
                    responses: 12,
                    players: 0,
                    cancelled: false,
                },
            ]);
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
            expect(result).toEqual([
                {
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
                },
            ]);
        });

        it('should return zero per-game averages when no games were initiated', async () => {
            (prisma.outcome.groupBy as Mock).mockResolvedValue([]);
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                {
                    id: 1,
                    year: 2021,
                    date: new Date('2021-01-03'),
                    status: 'NoGame',
                    mailSent: null,
                    comment: null,
                    bibs: null,
                    pickerGamesHistory: 10,
                },
            ]);

            const result = await outcomeService.getTurnoutByYear();
            expect(result[0].responsesPerGameInitiated).toBe(0);
            expect(result[0].yessesPerGameInitiated).toBe(0);
            expect(result[0].playersPerGamePlayed).toBe(0);
        });

        it('should skip null game days returned by get()', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(null);
            (prisma.outcome.groupBy as Mock).mockResolvedValue([]);

            const result = await outcomeService.getTurnout(999);
            expect(result).toHaveLength(1);
            expect(result[0]).toBeUndefined();
        });
    });

    describe('getByGameDay', () => {
        it('should retrieve Outcomes for GameDay id 1', async () => {
            const fixture = [
                {
                    ...createMockOutcome({ gameDayId: 1, playerId: 1 }),
                    player: createMockPlayer({ id: 1 }),
                    gameDay: createMockGameDay({ id: 1, status: 'AWin' }),
                },
                {
                    ...createMockOutcome({ gameDayId: 1, playerId: 2 }),
                    player: createMockPlayer({ id: 2 }),
                    gameDay: createMockGameDay({ id: 1, status: 'AWin' }),
                },
            ];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await outcomeService.getByGameDay(1);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: { gameDayId: 1, team: undefined },
                include: {
                    player: true,
                    gameDay: { select: { status: true } },
                },
            });
            expect(result).toEqual(
                // Both fixture outcomes are on team 'A' and gameDay.status
                // 'AWin', so both derive to 3 points.
                fixture.map(({ gameDay: _gameDay, ...outcome }) => ({
                    ...outcome,
                    points: 3,
                })),
            );
        });

        it('should return an empty list when retrieving outcomes for GameDay id 101', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);
            const result = await outcomeService.getByGameDay(101);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: { gameDayId: 101, team: undefined },
                include: {
                    player: true,
                    gameDay: { select: { status: true } },
                },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getAdminByGameDay', () => {
        it('should include active players without outcomes as response none rows', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockPlayer({
                        id: 1,
                        name: 'Alex Keeper',
                        finished: null,
                    }),
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
                    ...createMockPlayer({
                        id: 2,
                        name: 'Britt Winger',
                        finished: null,
                    }),
                    outcomes: [],
                },
            ]);

            const result = await outcomeService.getAdminByGameDay(25);

            expect(prisma.player.findMany).toHaveBeenCalledWith({
                where: {
                    finished: null,
                },
                orderBy: [{ name: 'asc' }, { id: 'asc' }],
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

        it('should derive points from the game day status when it exists', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(
                createMockGameDay({ id: 25, status: 'AWin' }),
            );
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockPlayer({ id: 1, finished: null }),
                    outcomes: [
                        createMockOutcome({
                            id: 101,
                            gameDayId: 25,
                            playerId: 1,
                            team: 'A',
                        }),
                    ],
                },
            ]);

            const result = await outcomeService.getAdminByGameDay(25);

            expect(result).toEqual([
                expect.objectContaining({ playerId: 1, points: 3 }),
            ]);
        });

        it('should treat a missing game day as NoGame, yielding null points', async () => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValueOnce(null);
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockPlayer({ id: 1, finished: null }),
                    outcomes: [
                        createMockOutcome({
                            id: 101,
                            gameDayId: 25,
                            playerId: 1,
                            team: 'A',
                        }),
                    ],
                },
            ]);

            const result = await outcomeService.getAdminByGameDay(25);

            expect(result).toEqual([
                expect.objectContaining({ playerId: 1, points: null }),
            ]);
        });
    });

    describe('getByBibs', () => {
        // Every game day defaults to 'Scheduled' (undecided) so it's excluded
        // from the WDL count unless a test overrides its status to a decided
        // one (AWin/BWin/Draw).
        const baseGameDays = [
            {
                id: 1,
                bibs: 'A',
                year: 2021,
                status: 'Scheduled',
                mailSent: new Date('2021-01-01'),
                date: new Date('2021-01-03'),
                comment: null,
                pickerGamesHistory: 10,
                cost: 500,
                hallCost: 5000,
            },
            {
                id: 2,
                bibs: 'B',
                year: 2021,
                status: 'Scheduled',
                mailSent: new Date('2021-01-08'),
                date: new Date('2021-01-10'),
                comment: null,
                pickerGamesHistory: 10,
                cost: 500,
                hallCost: 5000,
            },
            {
                id: 3,
                bibs: 'A',
                year: 2022,
                status: 'Scheduled',
                mailSent: new Date('2022-01-01'),
                date: new Date('2022-01-02'),
                comment: null,
                pickerGamesHistory: 10,
                cost: 500,
                hallCost: 5000,
            },
        ];

        it('returns correct WDL counts when bibs team A wins', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...baseGameDays[0], status: 'AWin' },
                baseGameDays[1],
                baseGameDays[2],
            ]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 1, drawn: 0, lost: 0 });
        });

        it('returns a loss when bibs team A loses', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...baseGameDays[0], status: 'BWin' },
                baseGameDays[1],
                baseGameDays[2],
            ]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 0, drawn: 0, lost: 1 });
        });

        it('returns a draw when the game day is drawn', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...baseGameDays[0], status: 'Draw' },
                baseGameDays[1],
                baseGameDays[2],
            ]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 0, drawn: 1, lost: 0 });
        });

        it('handles bibs=B correctly: bibs team B wins when team A loses', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                baseGameDays[0],
                { ...baseGameDays[1], status: 'BWin' },
                baseGameDays[2],
            ]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 1, drawn: 0, lost: 0 });
        });

        it('handles bibs=B correctly: bibs team B loses when team A wins', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                baseGameDays[0],
                { ...baseGameDays[1], status: 'AWin' },
                baseGameDays[2],
            ]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 0, drawn: 0, lost: 1 });
        });

        it('filters by year when year option is provided', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...baseGameDays[0], status: 'AWin' },
                baseGameDays[1],
                { ...baseGameDays[2], status: 'AWin' },
            ]);

            const result = await outcomeService.getByBibs({ year: 2021 });

            expect(result).toEqual({ won: 1, drawn: 0, lost: 0 });
        });

        it('returns all zeros when bibs is null on game days', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { ...baseGameDays[0], bibs: null, status: 'AWin' },
            ]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 0, drawn: 0, lost: 0 });
        });

        it('returns all zeros when no game day has a decided result', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue(baseGameDays);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 0, drawn: 0, lost: 0 });
        });

        it('returns all zeros when there are no game days', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([]);

            const result = await outcomeService.getByBibs({});

            expect(result).toEqual({ won: 0, drawn: 0, lost: 0 });
        });
    });

    describe('getTeamPlayersByGameDay', () => {
        it('should pass ordering to Prisma and return team players with outcomes and form history', async () => {
            const formHistory = 2;
            const gameDay8 = createMockGameDay({ id: 8, status: 'BWin' });
            const gameDay9 = createMockGameDay({ id: 9, status: 'AWin' });
            const gameDay10 = createMockGameDay({ id: 10, status: 'AWin' });
            // Outcomes arrive newest-first from Prisma; service reverses to oldest-first.
            // Both are on team 'A' (createMockOutcome default): gameDay9
            // (AWin) derives to 3 points, gameDay8 (BWin) derives to 0.
            const playerOneOutcomes = [
                {
                    ...createMockOutcome({
                        playerId: 1,
                        gameDayId: 9,
                    }),
                    gameDay: gameDay9,
                },
                {
                    ...createMockOutcome({
                        playerId: 1,
                        gameDayId: 8,
                    }),
                    gameDay: gameDay8,
                },
            ];

            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockOutcome({
                        id: 202,
                        gameDayId: 10,
                        playerId: 2,
                        team: 'A',
                        goalie: true,
                    }),
                    gameDay: gameDay10,
                    player: {
                        ...createMockPlayer({ id: 2, name: 'Player Two' }),
                        outcomes: [],
                    },
                },
                {
                    ...createMockOutcome({
                        id: 201,
                        gameDayId: 10,
                        playerId: 1,
                        team: 'A',
                    }),
                    gameDay: gameDay10,
                    player: {
                        ...createMockPlayer({ id: 1, name: 'Player One' }),
                        outcomes: playerOneOutcomes,
                    },
                },
            ]);

            const result = await outcomeService.getTeamPlayersByGameDay(
                10,
                'A',
                formHistory,
            );
            const expectedFindManyArgs: Partial<Prisma.OutcomeFindManyArgs> = {
                where: { gameDayId: 10, team: 'A' },
                orderBy: [{ goalie: 'desc' }, { player: { name: 'asc' } }],
                include: {
                    gameDay: true,
                    player: {
                        include: {
                            outcomes: {
                                where: {
                                    gameDayId: { lt: 10 },
                                    team: { not: null },
                                    gameDay: {
                                        status: {
                                            in: ['AWin', 'BWin', 'Draw'],
                                        },
                                    },
                                },
                                orderBy: { gameDayId: 'desc' },
                                take: formHistory,
                                include: { gameDay: true },
                            },
                        },
                    },
                },
            };

            expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                expect.objectContaining(expectedFindManyArgs),
            );
            expect(result).toHaveLength(2);

            // When Prisma is mocked, returned row order comes from the fixture.
            // Assert enrichment by player identity, while query ordering is
            // validated via the orderBy expectation above.
            const playerTwo = result.find((player) => player.id === 2);
            expect(playerTwo).toMatchObject({
                id: 2,
                outcome: {
                    playerId: 2,
                    gameDayId: 10,
                    team: 'A',
                    goalie: true,
                },
            });
            expect(playerTwo?.form).toMatchObject([
                { id: 0, gameDayId: 0, playerId: 2, points: null },
                { id: 0, gameDayId: 0, playerId: 2, points: null },
            ]);

            // Player One: outcomes reversed to oldest-first, no padding needed.
            const playerOne = result.find((player) => player.id === 1);
            expect(playerOne).toMatchObject({
                id: 1,
                outcome: { playerId: 1, gameDayId: 10, team: 'A' },
                form: [
                    expect.objectContaining({ gameDayId: 8, points: 0 }),
                    expect.objectContaining({ gameDayId: 9, points: 3 }),
                ],
            });
        });

        it('left-pads with unplayed sentinels when player has fewer games than formHistory', async () => {
            const formHistory = 4;
            const gameDay8 = createMockGameDay({ id: 8, status: 'Draw' });
            const gameDay9 = createMockGameDay({ id: 9, status: 'AWin' });
            const gameDay10 = createMockGameDay({
                id: 10,
                status: 'Scheduled',
            });
            // Player has only 2 games; should get 2 padding entries at the start.
            // Both on team 'A' (default): gameDay9 (AWin) -> 3, gameDay8 (Draw) -> 1.
            const playerOutcomes = [
                {
                    ...createMockOutcome({
                        playerId: 1,
                        gameDayId: 9,
                    }),
                    gameDay: gameDay9,
                },
                {
                    ...createMockOutcome({
                        playerId: 1,
                        gameDayId: 8,
                    }),
                    gameDay: gameDay8,
                },
            ];

            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockOutcome({
                        id: 201,
                        gameDayId: 10,
                        playerId: 1,
                        team: 'A',
                    }),
                    gameDay: gameDay10,
                    player: {
                        ...createMockPlayer({ id: 1 }),
                        outcomes: playerOutcomes,
                    },
                },
            ]);

            const result = await outcomeService.getTeamPlayersByGameDay(
                10,
                'A',
                formHistory,
            );

            expect(result[0].form).toMatchObject([
                { id: 0, gameDayId: 0, points: null }, // padding
                { id: 0, gameDayId: 0, points: null }, // padding
                { gameDayId: 8, points: 1 }, // oldest actual game
                { gameDayId: 9, points: 3 }, // newest actual game
            ]);
        });

        it('throws InternalError when an outcome is missing its player relation', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                {
                    ...createMockOutcome({
                        id: 201,
                        gameDayId: 10,
                        playerId: 1,
                        team: 'A',
                    }),
                    player: null,
                },
            ]);

            await expect(
                outcomeService.getTeamPlayersByGameDay(10, 'A'),
            ).rejects.toThrow('Outcome 201 is missing its player relation.');
        });
    });

    describe('getHistoryByPlayer', () => {
        // UTC midnight helper — mirrors the production implementation so date
        // comparisons in assertions are timezone-stable.
        const utcDay = (y: number, m: number, d: number) =>
            new Date(Date.UTC(y, m, d));

        /**
         * Queue responses for the two parallel queries that getHistoryByPlayer
         * issues: (1) prisma.outcome.findMany, (2) prisma.gameDay.findMany for
         * every game day (any status) in the date range.
         */
        const mockQueries = (
            outcomes: unknown[],
            gameDaysInRange: unknown[],
        ) => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(outcomes);
            (prisma.gameDay.findMany as Mock).mockResolvedValueOnce(
                gameDaysInRange,
            );
        };

        /** Status that yields the given points for team 'A'. */
        const statusForPoints = (points: number | null) => {
            switch (points) {
                case 3:
                    return 'AWin';
                case 1:
                    return 'Draw';
                case 0:
                    return 'BWin';
                default:
                    return 'Scheduled';
            }
        };

        const makeOutcome = (
            gameDayId: number,
            date: Date,
            points: number | null = 3,
        ) => ({
            ...createMockOutcome({
                id: gameDayId * 100,
                gameDayId,
                playerId: 1,
                team: 'A',
            }),
            gameDay: createMockGameDay({
                id: gameDayId,
                date,
                status: statusForPoints(points),
            }),
        });

        const makeGameDay = (id: number, date: Date, game: boolean) =>
            createMockGameDay({
                id,
                date,
                status: game ? 'Scheduled' : 'NoGame',
            });

        describe('input validation', () => {
            it('rejects playerId < 1', async () => {
                await expect(
                    outcomeService.getHistoryByPlayer(0, 2024),
                ).rejects.toThrow();
                expect(prisma.outcome.findMany).not.toHaveBeenCalled();
            });

            it('rejects year below 1900 (and not 0)', async () => {
                await expect(
                    outcomeService.getHistoryByPlayer(1, 1899),
                ).rejects.toThrow();
                expect(prisma.outcome.findMany).not.toHaveBeenCalled();
            });

            it('rejects year above 2100', async () => {
                await expect(
                    outcomeService.getHistoryByPlayer(1, 2101),
                ).rejects.toThrow();
                expect(prisma.outcome.findMany).not.toHaveBeenCalled();
            });

            it('accepts year = 0 (all-time sentinel)', async () => {
                mockQueries([], []);
                await expect(
                    outcomeService.getHistoryByPlayer(1, 0),
                ).resolves.toEqual([]);
            });

            it('rejects an invalid fromDate', async () => {
                await expect(
                    outcomeService.getHistoryByPlayer(
                        1,
                        0,
                        new Date('not-a-date'),
                    ),
                ).rejects.toThrow();
                expect(prisma.outcome.findMany).not.toHaveBeenCalled();
            });
        });

        describe('year filtering', () => {
            it('applies UTC year bounds when year > 0', async () => {
                mockQueries([], []);
                await outcomeService.getHistoryByPlayer(1, 2024);
                const yearStart = utcDay(2024, 0, 1);
                const yearEnd = utcDay(2025, 0, 1);
                expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            playerId: 1,
                            gameDay: {
                                status: { not: 'NoGame' },
                                date: { gte: yearStart, lt: yearEnd },
                            },
                        },
                    }),
                );
                // The single gameDay.findMany call fetches every game day in
                // the date range, regardless of status.
                expect(prisma.gameDay.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            date: { gte: yearStart, lt: yearEnd },
                        },
                    }),
                );
            });

            it('applies only tomorrow as lt when year = 0 and fromDate is absent', async () => {
                // Pin time so "tomorrow" is deterministic inside the service call.
                vi.useFakeTimers();
                vi.setSystemTime(new Date('2024-09-15T10:00:00Z'));
                try {
                    mockQueries([], []);
                    await outcomeService.getHistoryByPlayer(1, 0);
                    const tomorrow = utcDay(2024, 8, 16); // 2024-09-16 UTC
                    expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            where: {
                                playerId: 1,
                                gameDay: {
                                    status: { not: 'NoGame' },
                                    date: { lt: tomorrow },
                                },
                            },
                        }),
                    );
                } finally {
                    vi.useRealTimers();
                }
            });
        });

        describe('fromDate handling', () => {
            it('normalises fromDate to UTC midnight as gte when year = 0', async () => {
                vi.useFakeTimers();
                vi.setSystemTime(new Date('2024-09-15T10:00:00Z'));
                try {
                    mockQueries([], []);
                    // Use noon UTC so the UTC date is unambiguous regardless of local tz
                    const from = new Date('2020-06-15T12:00:00Z');
                    await outcomeService.getHistoryByPlayer(1, 0, from);
                    // UTC midnight of the same day; lt is clamped to tomorrow
                    expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            where: {
                                playerId: 1,
                                gameDay: {
                                    status: { not: 'NoGame' },
                                    date: {
                                        gte: utcDay(2020, 5, 15),
                                        lt: utcDay(2024, 8, 16),
                                    },
                                },
                            },
                        }),
                    );
                } finally {
                    vi.useRealTimers();
                }
            });

            it('uses year start as gte when fromDate predates it', async () => {
                mockQueries([], []);
                await outcomeService.getHistoryByPlayer(
                    1,
                    2024,
                    new Date('2022-01-01T00:00:00Z'),
                );
                const yearStart = utcDay(2024, 0, 1);
                const yearEnd = utcDay(2025, 0, 1);
                expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            playerId: 1,
                            gameDay: {
                                status: { not: 'NoGame' },
                                date: { gte: yearStart, lt: yearEnd },
                            },
                        },
                    }),
                );
            });

            it('uses fromDate as gte when it postdates the year start', async () => {
                mockQueries([], []);
                const from = new Date('2024-06-01T00:00:00Z');
                await outcomeService.getHistoryByPlayer(1, 2024, from);
                const yearEnd = utcDay(2025, 0, 1);
                expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            playerId: 1,
                            gameDay: {
                                status: { not: 'NoGame' },
                                date: { gte: utcDay(2024, 5, 1), lt: yearEnd },
                            },
                        },
                    }),
                );
            });
        });

        describe('toDate handling', () => {
            it('caps the upper bound to UTC next-day of toDate when within the year', async () => {
                mockQueries([], []);
                // finished 2024-06-14; exclusive upper bound should be 2024-06-15 UTC,
                // which is earlier than both yearEnd and tomorrow (today is 2026).
                const to = new Date('2024-06-14T00:00:00Z');
                await outcomeService.getHistoryByPlayer(1, 2024, undefined, to);
                expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            playerId: 1,
                            gameDay: {
                                status: { not: 'NoGame' },
                                date: {
                                    gte: utcDay(2024, 0, 1),
                                    lt: utcDay(2024, 5, 15),
                                },
                            },
                        },
                    }),
                );
            });

            it('uses year end as lt when toDate extends beyond the year', async () => {
                mockQueries([], []);
                // toDate is 2025-06-01, but year=2024 so yearEnd (2025-01-01) is earlier
                const to = new Date('2025-06-01T00:00:00Z');
                await outcomeService.getHistoryByPlayer(1, 2024, undefined, to);
                expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            playerId: 1,
                            gameDay: {
                                status: { not: 'NoGame' },
                                date: {
                                    gte: utcDay(2024, 0, 1),
                                    lt: utcDay(2025, 0, 1),
                                },
                            },
                        },
                    }),
                );
            });

            it('uses year=0 with toDate to clamp all-time history at the finished date', async () => {
                mockQueries([], []);
                // to = 2023-12-31; next day = 2024-01-01, which is earlier than tomorrow (2026)
                const to = new Date('2023-12-31T00:00:00Z');
                await outcomeService.getHistoryByPlayer(1, 0, undefined, to);
                expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                    expect.objectContaining({
                        where: {
                            playerId: 1,
                            gameDay: {
                                status: { not: 'NoGame' },
                                date: { lt: utcDay(2024, 0, 1) },
                            },
                        },
                    }),
                );
            });

            it('sets dateRange.lt from endDate but no gte when startDate is absent', async () => {
                // year=0, no fromDate → startDate is undefined; endDate is still computed
                // (at minimum tomorrow). Only the lt branch of dateRange should fire,
                // and dateFilter must be { date: dateRange } not {}.
                vi.useFakeTimers();
                vi.setSystemTime(new Date('2024-09-15T10:00:00Z'));
                try {
                    mockQueries([], []);
                    const to = new Date('2024-09-10T00:00:00Z');
                    await outcomeService.getHistoryByPlayer(
                        1,
                        0,
                        undefined,
                        to,
                    );
                    // endDate = min(tomorrow=2024-09-16, nextDayOfTo=2024-09-11) = 2024-09-11
                    // startDate is undefined → no gte; dateFilter uses { date: { lt } } not {}
                    expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            where: {
                                playerId: 1,
                                gameDay: {
                                    status: { not: 'NoGame' },
                                    date: { lt: utcDay(2024, 8, 11) },
                                },
                            },
                        }),
                    );
                } finally {
                    vi.useRealTimers();
                }
            });

            it('dateFilter always uses { date: dateRange } rather than {} because endDate always resolves to at least tomorrow', async () => {
                // Even with year=0 and no fromDate/toDate, endDate = tomorrow is always
                // present, so (startDate ?? endDate) is always truthy and dateFilter is
                // never the empty object fallback.
                vi.useFakeTimers();
                vi.setSystemTime(new Date('2024-09-15T10:00:00Z'));
                try {
                    mockQueries([], []);
                    await outcomeService.getHistoryByPlayer(1, 0);
                    const tomorrow = utcDay(2024, 8, 16);
                    // date key must be present — empty {} would omit it entirely
                    expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            where: expect.objectContaining({
                                gameDay: expect.objectContaining({
                                    date: { lt: tomorrow },
                                }) as unknown,
                            }) as unknown,
                        }),
                    );
                } finally {
                    vi.useRealTimers();
                }
            });
        });

        describe('future-day exclusion', () => {
            it('excludes game days scheduled after today even when year = 0 and no toDate', async () => {
                vi.useFakeTimers();
                vi.setSystemTime(new Date('2024-09-15T10:00:00Z'));
                try {
                    mockQueries([], []);
                    await outcomeService.getHistoryByPlayer(1, 0);
                    const tomorrow = utcDay(2024, 8, 16); // 2024-09-16 UTC
                    expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            where: {
                                playerId: 1,
                                gameDay: {
                                    status: { not: 'NoGame' },
                                    date: { lt: tomorrow },
                                },
                            },
                        }),
                    );
                } finally {
                    vi.useRealTimers();
                }
            });

            it('does not show game days in the future even within a current year', async () => {
                vi.useFakeTimers();
                vi.setSystemTime(new Date('2024-09-15T10:00:00Z'));
                try {
                    mockQueries([], []);
                    await outcomeService.getHistoryByPlayer(1, 2024);
                    const tomorrow = utcDay(2024, 8, 16); // 2024-09-16 UTC — earlier than yearEnd 2025-01-01
                    expect(prisma.outcome.findMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            where: {
                                playerId: 1,
                                gameDay: {
                                    status: { not: 'NoGame' },
                                    date: {
                                        gte: utcDay(2024, 0, 1),
                                        lt: tomorrow,
                                    },
                                },
                            },
                        }),
                    );
                } finally {
                    vi.useRealTimers();
                }
            });
        });

        describe('uninvited game-day synthetic entries', () => {
            it('adds a synthetic null-points entry for a game=true day with no outcome', async () => {
                const d1 = new Date('2024-03-07T18:00:00Z');
                // outcomes: empty — player was not invited
                // the single gameDay.findMany call returns one Scheduled day
                (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);
                (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([
                    makeGameDay(42, d1, true),
                ]);

                const result = await outcomeService.getHistoryByPlayer(1, 2024);

                expect(result).toHaveLength(1);
                expect(result[0]).toMatchObject({
                    id: -42,
                    gameDayId: 42,
                    playerId: 1,
                    points: null,
                });
                expect(result[0].gameDay?.status).not.toBe('NoGame');
            });

            it('does not duplicate a game day that already has an outcome', async () => {
                const d1 = new Date('2024-03-07T18:00:00Z');
                const outcome = makeOutcome(42, d1, 3);
                (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                    outcome,
                ]);
                // the game-days-in-range list includes the same game day —
                // must not produce a duplicate
                (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([
                    makeGameDay(42, d1, true),
                ]);

                const result = await outcomeService.getHistoryByPlayer(1, 2024);

                expect(result).toHaveLength(1);
                expect(result[0].points).toBe(3); // real outcome preserved
            });

            it('returns both the outcome and a separate uninvited entry when distinct game days', async () => {
                const d1 = new Date('2024-03-07T18:00:00Z');
                const d2 = new Date('2024-03-14T18:00:00Z');
                (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                    makeOutcome(1, d1, 3),
                ]);
                (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([
                    makeGameDay(1, d1, true), // already has outcome — must not duplicate
                    makeGameDay(2, d2, true), // no outcome — should be synthetic
                ]);

                const result = await outcomeService.getHistoryByPlayer(1, 2024);

                expect(result).toHaveLength(2);
                expect(result[0]).toMatchObject({ gameDayId: 1, points: 3 });
                expect(result[1]).toMatchObject({
                    id: -2,
                    gameDayId: 2,
                    points: null,
                });
            });
        });

        describe('no-game day synthetic entries', () => {
            it('creates a synthetic entry with id = -gameDay.id and status = NoGame', async () => {
                const noGame = makeGameDay(
                    7,
                    new Date('2024-03-01T00:00:00Z'),
                    false,
                );
                mockQueries([], [noGame]);
                const result = await outcomeService.getHistoryByPlayer(1, 2024);
                expect(result).toHaveLength(1);
                expect(result[0].id).toBe(-7);
                expect(result[0].gameDayId).toBe(7);
                expect(result[0].playerId).toBe(1);
                expect(result[0].points).toBeNull();
                expect(result[0].gameDay?.id).toBe(7);
                expect(result[0].gameDay?.status).toBe('NoGame');
            });

            it('returns an empty array when both queries return nothing', async () => {
                mockQueries([], []);
                await expect(
                    outcomeService.getHistoryByPlayer(1, 2024),
                ).resolves.toEqual([]);
            });
        });

        describe('merge ordering', () => {
            it('interleaves outcomes and no-game days in date order', async () => {
                const d1 = new Date('2024-01-07T18:00:00Z');
                const d2 = new Date('2024-01-14T18:00:00Z');
                const d3 = new Date('2024-01-21T18:00:00Z');
                (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                    makeOutcome(1, d1, 3),
                    makeOutcome(3, d3, 0),
                ]);
                (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([
                    makeGameDay(2, d2, false),
                    makeGameDay(1, d1, true),
                    makeGameDay(3, d3, true),
                ]);

                const result = await outcomeService.getHistoryByPlayer(1, 2024);

                expect(result).toHaveLength(3);
                expect(result[0]).toMatchObject({ gameDayId: 1, points: 3 });
                expect(result[1]).toMatchObject({ id: -2, gameDayId: 2 });
                expect(result[2]).toMatchObject({ gameDayId: 3, points: 0 });
            });

            it('breaks ties on equal dates by gameDay.id ascending', async () => {
                const date = new Date('2024-01-07T18:00:00Z');
                (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                    makeOutcome(1, date, 3),
                ]);
                (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([
                    makeGameDay(2, date, false),
                    makeGameDay(1, date, true),
                ]);

                const result = await outcomeService.getHistoryByPlayer(1, 2024);

                expect(result[0].gameDay!.id).toBe(1);
                expect(result[1].gameDay!.id).toBe(2);
            });

            it('handles all no-game days appearing before all outcomes', async () => {
                const d1 = new Date('2024-01-07T18:00:00Z');
                const d2 = new Date('2024-01-14T18:00:00Z');
                (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                    makeOutcome(2, d2, 3),
                ]);
                (prisma.gameDay.findMany as Mock).mockResolvedValueOnce([
                    makeGameDay(1, d1, false),
                    makeGameDay(2, d2, true),
                ]);

                const result = await outcomeService.getHistoryByPlayer(1, 2024);

                expect(result[0]).toMatchObject({ id: -1, gameDayId: 1 });
                expect(result[1]).toMatchObject({ gameDayId: 2, points: 3 });
            });
        });
    });

    describe('getByPlayer', () => {
        it('should retrieve Outcomes for Player ID 1', async () => {
            const fixture = [
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 1,
                    gameDay: createMockGameDay({ id: 1, status: 'AWin' }),
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 2,
                    gameDay: createMockGameDay({ id: 2, status: 'BWin' }),
                },
            ];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await outcomeService.getByPlayer(1);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: { playerId: 1 },
                include: { gameDay: { select: { status: true } } },
            });
            // Both outcomes are on team 'A' (defaultOutcome default):
            // gameDay 1 (AWin) -> 3 points, gameDay 2 (BWin) -> 0 points.
            expect(result).toEqual([
                { ...defaultOutcome, playerId: 1, gameDayId: 1, points: 3 },
                { ...defaultOutcome, playerId: 1, gameDayId: 2, points: 0 },
            ]);
        });

        it('should return an empty list when retrieving Outcomes for Player id 11', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);
            const result = await outcomeService.getByPlayer(11);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: { playerId: 11 },
                include: { gameDay: { select: { status: true } } },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getRecentGamePoints', () => {
        it('should retrieve recent points using the legacy stored procedure filters', async () => {
            const recentPointsRows = [
                { team: 'A', gameDay: { status: 'AWin' } },
                { team: 'A', gameDay: { status: 'Draw' } },
                { team: 'A', gameDay: { status: 'BWin' } },
                { team: 'A', gameDay: { status: 'Scheduled' } },
            ];
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(
                recentPointsRows,
            );

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
                    team: true,
                    gameDay: { select: { status: true } },
                },
            });
            expect(result).toEqual([3, 1, 0, null]);
        });

        it('should throw for invalid input values', async () => {
            await expect(
                outcomeService.getRecentGamePoints(0, 1),
            ).rejects.toThrow();
            await expect(
                outcomeService.getRecentGamePoints(1, 0),
            ).rejects.toThrow();
            expect(prisma.outcome.findMany).not.toHaveBeenCalled();
        });
    });

    describe('getRecentAverage', () => {
        it('should calculate average from the requested history size', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { team: 'A', gameDay: { status: 'AWin' } },
                { team: 'A', gameDay: { status: 'Draw' } },
                { team: 'A', gameDay: { status: 'BWin' } },
                { team: 'A', gameDay: { status: 'AWin' } },
            ]);

            const result = await outcomeService.getRecentAverage(25, 7, 3);

            expect(result).toBeCloseTo(4 / 3, 10);
        });

        it('should credit 1.45 points for missing recent games', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { team: 'A', gameDay: { status: 'AWin' } },
                { team: 'A', gameDay: { status: 'BWin' } },
            ]);

            const result = await outcomeService.getRecentAverage(25, 7, 5);

            expect(result).toBeCloseTo(1.47, 10);
        });

        it('should treat null points as zero while still counting the game', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { team: 'A', gameDay: { status: 'Scheduled' } },
                { team: 'A', gameDay: { status: 'AWin' } },
            ]);

            const result = await outcomeService.getRecentAverage(25, 7, 3);

            expect(result).toBeCloseTo(4.45 / 3, 10);
        });

        it('should throw for invalid history', async () => {
            await expect(
                outcomeService.getRecentAverage(1, 1, 0),
            ).rejects.toThrow();
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
            await expect(
                outcomeService.getPlayerGamesPlayed(0),
            ).rejects.toThrow();
            expect(prisma.outcome.count).not.toHaveBeenCalled();
        });
    });

    describe('getPlayerGamesPlayedBeforeGameDay', () => {
        it('should count games with a team assigned before the given game day', async () => {
            (prisma.outcome.count as Mock).mockResolvedValueOnce(9);

            const result =
                await outcomeService.getPlayerGamesPlayedBeforeGameDay(7, 25);

            expect(prisma.outcome.count).toHaveBeenCalledWith({
                where: {
                    playerId: 7,
                    team: {
                        not: null,
                    },
                    gameDayId: {
                        lt: 25,
                    },
                },
            });
            expect(result).toBe(9);
        });

        it('should throw for invalid input', async () => {
            await expect(
                outcomeService.getPlayerGamesPlayedBeforeGameDay(0, 25),
            ).rejects.toThrow();
            await expect(
                outcomeService.getPlayerGamesPlayedBeforeGameDay(7, 0),
            ).rejects.toThrow();
            expect(prisma.outcome.count).not.toHaveBeenCalled();
        });
    });

    describe('getGamesPlayedByPlayer', () => {
        it('should count outcomes with points for a player in a specific year', async () => {
            (prisma.outcome.count as Mock).mockResolvedValueOnce(10);
            const result = await outcomeService.getGamesPlayedByPlayer(1, 2021);
            expect(prisma.outcome.count).toHaveBeenCalledWith({
                where: {
                    playerId: 1,
                    team: { not: null },
                    gameDay: {
                        status: { in: ['AWin', 'BWin', 'Draw'] },
                        date: {
                            gte: new Date(Date.UTC(2021, 0, 1)),
                            lt: new Date(Date.UTC(2022, 0, 1)),
                        },
                    },
                },
            });
            expect(result).toBe(10);
        });

        it('should count outcomes with points for a player across all years when year is 0', async () => {
            (prisma.outcome.count as Mock).mockResolvedValueOnce(25);
            const result = await outcomeService.getGamesPlayedByPlayer(1, 0);
            expect(prisma.outcome.count).toHaveBeenCalledWith({
                where: {
                    playerId: 1,
                    team: { not: null },
                    gameDay: {
                        status: { in: ['AWin', 'BWin', 'Draw'] },
                    },
                },
            });
            expect(result).toBe(25);
        });

        it('should count outcomes with points for a player up to a specific game day', async () => {
            (prisma.outcome.count as Mock).mockResolvedValueOnce(8);
            const result = await outcomeService.getGamesPlayedByPlayer(1, 0, 8);
            expect(prisma.outcome.count).toHaveBeenCalledWith({
                where: {
                    playerId: 1,
                    team: { not: null },
                    gameDay: {
                        status: { in: ['AWin', 'BWin', 'Draw'] },
                        id: { lte: 8 },
                    },
                },
            });
            expect(result).toBe(8);
        });

        it('should return 0 for a player with no matching outcomes', async () => {
            (prisma.outcome.count as Mock).mockResolvedValueOnce(0);
            const result = await outcomeService.getGamesPlayedByPlayer(
                11,
                2021,
            );
            expect(result).toBe(0);
        });
    });

    describe('getLatestGamePlayedByYear', () => {
        const defaultGameDay = {
            id: 1,
            status: 'AWin',
            mailSent: null,
            comment: null,
            bibs: null,
            pickerGamesHistory: 10,
        };

        it('should retrieve the correct latest game played for year 2021', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    ...defaultOutcome,
                    gameDayId: 1,
                    gameDay: {
                        ...defaultGameDay,
                        id: 1,
                        date: new Date('2021-01-01'),
                    },
                },
            ]);
            const result = await outcomeService.getLatestGamePlayedByYear(2021);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    team: {
                        not: null,
                    },
                    gameDay: {
                        status: { in: ['AWin', 'BWin', 'Draw'] },
                        date: {
                            gte: new Date(Date.UTC(2021, 0, 1)),
                            lt: new Date(Date.UTC(2022, 0, 1)),
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
            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    ...defaultOutcome,
                    gameDayId: 3,
                    gameDay: {
                        ...defaultGameDay,
                        id: 3,
                        date: new Date('2023-01-01'),
                    },
                },
            ]);
            const result = await outcomeService.getLatestGamePlayedByYear(0);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    team: {
                        not: null,
                    },
                    gameDay: {
                        status: { in: ['AWin', 'BWin', 'Draw'] },
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
            (prisma.outcome.create as Mock).mockResolvedValueOnce({
                ...defaultOutcome,
                ...defaultOutcomeInput,
            });
            const result = await outcomeService.create(defaultOutcomeInput);
            expect(prisma.outcome.create).toHaveBeenCalledWith({
                data: defaultOutcomeInput,
            });
            expect(result).toEqual({
                ...defaultOutcome,
                ...defaultOutcomeInput,
            });
        });

        it('should refuse to create an Outcome with invalid data', async () => {
            await expect(
                outcomeService.create({
                    ...defaultOutcomeInput,
                    response: 'Wibble',
                } as unknown as OutcomeWriteInput),
            ).rejects.toThrow();
            await expect(
                outcomeService.create({
                    ...defaultOutcomeInput,
                    responseInterval: -1,
                }),
            ).rejects.toThrow();
            await expect(
                outcomeService.create({
                    ...defaultOutcomeInput,
                    team: 'X',
                } as unknown as OutcomeWriteInput),
            ).rejects.toThrow();
            await expect(
                outcomeService.create({
                    ...defaultOutcomeInput,
                    playerId: -1,
                }),
            ).rejects.toThrow();
            await expect(
                outcomeService.create({
                    ...defaultOutcomeInput,
                    gameDayId: -1,
                }),
            ).rejects.toThrow();
        });

        it('should refuse to create an Outcome that has the same GameDay ID and Player ID as an existing one', async () => {
            (prisma.outcome.create as Mock).mockRejectedValueOnce(
                new Error('Outcome already exists'),
            );
            await expect(
                outcomeService.create({
                    ...defaultOutcomeInput,
                    playerId: 1,
                    gameDayId: 1,
                }),
            ).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create an outcome where the combination of GameDay ID and Player ID did not exist', async () => {
            (prisma.outcome.upsert as Mock).mockResolvedValueOnce({
                ...defaultOutcome,
                ...defaultOutcomeInput,
            });
            const result = await outcomeService.upsert(defaultOutcomeInput);
            expect(prisma.outcome.upsert).toHaveBeenCalledWith({
                where: {
                    gameDayId_playerId: {
                        gameDayId: defaultOutcomeInput.gameDayId,
                        playerId: defaultOutcomeInput.playerId,
                    },
                },
                create: defaultOutcomeInput,
                update: defaultOutcomeInput,
            });
            expect(result).toEqual({
                ...defaultOutcome,
                ...defaultOutcomeInput,
            });
        });

        it('should update an existing Outcome where the combination of GameDay ID and Player ID already existed', async () => {
            const updatedOutcome: OutcomeWriteInput = {
                ...defaultOutcomeInput,
                playerId: 1,
                gameDayId: 1,
                response: PlayerResponseSchema.parse('No'),
                comment: 'Updated comment',
            };
            (prisma.outcome.upsert as Mock).mockResolvedValueOnce({
                ...updatedOutcome,
                id: 1,
            });
            const result = await outcomeService.upsert(updatedOutcome);
            expect(prisma.outcome.upsert).toHaveBeenCalledWith({
                where: { gameDayId_playerId: { gameDayId: 1, playerId: 1 } },
                create: updatedOutcome,
                update: updatedOutcome,
            });
            expect(result).toEqual({
                ...updatedOutcome,
                id: 1,
            });
        });
    });

    describe('delete', () => {
        it('should delete an existing Outcome', async () => {
            (prisma.outcome.delete as Mock).mockResolvedValueOnce({
                ...defaultOutcome,
                gameDayId: 1,
                playerId: 1,
            });
            await outcomeService.delete(1, 1);
            expect(prisma.outcome.delete).toHaveBeenCalledWith({
                where: { gameDayId_playerId: { gameDayId: 1, playerId: 1 } },
            });
        });

        it('should silently return when asked to delete an Outcome that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.outcome.delete as Mock).mockRejectedValueOnce(
                notFoundError,
            );
            await outcomeService.delete(7, 16);
            expect(prisma.outcome.delete).toHaveBeenCalledWith({
                where: { gameDayId_playerId: { gameDayId: 7, playerId: 16 } },
            });
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.outcome.delete as Mock).mockRejectedValueOnce(
                new Error('db exploded'),
            );
            await expect(outcomeService.delete(1, 1)).rejects.toThrow(
                'db exploded',
            );
        });
    });

    describe('deleteAll', () => {
        it('should delete all Outcomes', async () => {
            (prisma.outcome.deleteMany as Mock).mockResolvedValueOnce({
                count: 0,
            });
            await outcomeService.deleteAll();
            expect(prisma.outcome.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

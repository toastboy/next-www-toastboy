import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { TableNameSchema } from 'prisma/zod/schemas';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { InternalError } from '@/lib/errors';
import gameDayService from '@/services/GameDay';
import playerRecordService from '@/services/PlayerRecord';
import {
    createMockPlayerRecord,
    defaultPlayerRecord,
} from '@/tests/mocks/data/playerRecord';
import { loadJsonFixture } from '@/tests/shared/fixtures';

describe('PlayerRecordService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct PlayerRecord for Player 12, Year 2021 and GameDay 15', async () => {
            (prisma.playerRecord.findUnique as Mock).mockResolvedValueOnce({
                ...defaultPlayerRecord,
                gameDayId: 15,
                playerId: 12,
            });
            const result = await playerRecordService.get(12, 2021, 15);
            expect(prisma.playerRecord.findUnique).toHaveBeenCalledWith({
                where: {
                    playerId_year_gameDayId: {
                        playerId: 12,
                        year: 2021,
                        gameDayId: 15,
                    },
                },
            });
            expect(result).toMatchObject({
                ...defaultPlayerRecord,
                gameDayId: 15,
                playerId: 12,
            });
            expect(typeof result?.scorePoints).toBe('number');
        });

        it('should return null for Player 16, Year 2022, GameDay 7', async () => {
            (prisma.playerRecord.findUnique as Mock).mockResolvedValueOnce(
                null,
            );
            const result = await playerRecordService.get(16, 2022, 7);
            expect(prisma.playerRecord.findUnique).toHaveBeenCalledWith({
                where: {
                    playerId_year_gameDayId: {
                        playerId: 16,
                        year: 2022,
                        gameDayId: 7,
                    },
                },
            });
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should retrieve all PlayerRecords', async () => {
            const fixture = [
                defaultPlayerRecord,
                { ...defaultPlayerRecord, playerId: 2, gameDayId: 16 },
            ];
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce(
                fixture,
            );
            const result = await playerRecordService.getAll();
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({});
            expect(result).toEqual(fixture);
        });
    });

    describe('getProgress', () => {
        it('should retrieve the correct numbers for PlayerRecords and last GameDay', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValue({
                gameDayId: 15,
            });

            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 10,
            });

            const result = await playerRecordService.getProgress();
            expect(result).toEqual([10, 15]);
            expect(prisma.outcome.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.playerRecord.findFirst).toHaveBeenCalledTimes(1);
        });

        it('should return [0, lastGameDay] if there are no PlayerRecords', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValue({
                gameDayId: 15,
            });

            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(null);

            const result = await playerRecordService.getProgress();
            expect(result).toEqual([0, 15]);
        });

        it('should return null if there are no Outcomes', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValue(null);

            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(null);

            const result = await playerRecordService.getProgress();
            expect(result).toBeNull();
        });
    });

    describe('getAllYears mostRecentFirst', () => {
        it('should return years in descending order with 0 first when mostRecentFirst is true', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
                { _max: { id: 1035 }, year: 2021 },
                { _max: { id: 1085 }, year: 2022 },
            ]);

            const result = await playerRecordService.getAllYears({
                mostRecentFirst: true,
            });
            expect(result).toEqual([0, 2022, 2021]);
        });
    });

    describe('getAllYears', () => {
        it('should retrieve the correct years', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
                {
                    _max: {
                        id: 1035,
                    },
                    year: 2021,
                },
            ]);
            (prisma.playerRecord.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 1085,
                    year: 0,
                },
                {
                    gameDayId: 1035,
                    year: 2021,
                },
                {
                    gameDayId: 1085,
                    year: 2022,
                },
            ]);

            const result = await playerRecordService.getAllYears({});
            expect(result).toEqual([2021, 0]);
        });

        it('should include an in-progress current year by default', async () => {
            (prisma.gameDay.groupBy as Mock).mockImplementation(
                (args: {
                    where?: {
                        date?: {
                            lte?: Date;
                        };
                    };
                }) => {
                    const seasonEnderId = args.where?.date?.lte ? 1249 : 1300;
                    return Promise.resolve([
                        {
                            _max: {
                                id: seasonEnderId,
                            },
                            year: 2026,
                        },
                    ]);
                },
            );

            (prisma.playerRecord.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 1249,
                    year: 2026,
                },
                {
                    gameDayId: 1249,
                    year: 0,
                },
            ]);

            const result = await playerRecordService.getAllYears({});
            expect(result).toEqual([2026, 0]);
        });

        it('should exclude an in-progress current year when requesting completed seasons only', async () => {
            (prisma.gameDay.groupBy as Mock).mockImplementation(
                (args: {
                    where?: {
                        date?: {
                            lte?: Date;
                        };
                    };
                }) => {
                    const seasonEnderId = args.where?.date?.lte ? 1249 : 1300;
                    return Promise.resolve([
                        {
                            _max: {
                                id: seasonEnderId,
                            },
                            year: 2026,
                        },
                    ]);
                },
            );

            (prisma.playerRecord.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 1249,
                    year: 2026,
                },
                {
                    gameDayId: 1249,
                    year: 0,
                },
            ]);

            const result = await playerRecordService.getAllYears({
                completed: true,
            });
            expect(result).toEqual([0]);
        });

        it('should retrieve the correct years even if the query returns them in a weird order', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
                {
                    _max: {
                        id: 1035,
                    },
                    year: 2021,
                },
                {
                    _max: {
                        id: 1085,
                    },
                    year: 2022,
                },
            ]);
            (prisma.playerRecord.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 1035,
                    year: 2021,
                },
                {
                    gameDayId: 1085,
                    year: 0,
                },
                {
                    gameDayId: 1085,
                    year: 2022,
                },
            ]);

            const result = await playerRecordService.getAllYears({});
            expect(result).toEqual([2021, 2022, 0]);
        });
    });

    describe('getByGameDay', () => {
        it('should retrieve PlayerRecords for GameDay id 15', async () => {
            const fixture = [
                { ...defaultPlayerRecord, gameDayId: 15, playerId: 1 },
                { ...defaultPlayerRecord, gameDayId: 15, playerId: 2 },
            ];
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce(
                fixture,
            );
            const result = await playerRecordService.getByGameDay(15);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({
                where: { gameDayId: 15 },
            });
            expect(result).toEqual(fixture);
        });

        it('should retrieve PlayerRecords for GameDay id 15 and year 2021', async () => {
            const fixture = [
                { ...defaultPlayerRecord, gameDayId: 15, year: 2021 },
            ];
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce(
                fixture,
            );
            const result = await playerRecordService.getByGameDay(15, 2021);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({
                where: { gameDayId: 15, year: 2021 },
            });
            expect(result).toEqual(fixture);
        });

        it('should return an empty list when retrieving playerRecords for GameDay id 101', async () => {
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce([]);
            const result = await playerRecordService.getByGameDay(101);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({
                where: { gameDayId: 101 },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getByPlayer', () => {
        it('should retrieve PlayerRecords for Player ID 12', async () => {
            const fixture = [
                { ...defaultPlayerRecord, playerId: 12, gameDayId: 15 },
                { ...defaultPlayerRecord, playerId: 12, gameDayId: 20 },
            ];
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce(
                fixture,
            );
            const result = await playerRecordService.getByPlayer(12);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({
                where: { playerId: 12 },
            });
            expect(result).toEqual(fixture);
        });

        it('should retrieve PlayerRecords for Player ID 12 and year 0 (all-time)', async () => {
            const fixture = [
                {
                    ...defaultPlayerRecord,
                    playerId: 12,
                    gameDayId: 15,
                    year: 0,
                },
            ];
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce(
                fixture,
            );
            const result = await playerRecordService.getByPlayer(12, 0);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({
                where: { playerId: 12, year: 0 },
            });
            expect(result).toEqual(fixture);
        });

        it('should return an empty list when retrieving PlayerRecords for Player id 21', async () => {
            (prisma.playerRecord.findMany as Mock).mockResolvedValueOnce([]);
            const result = await playerRecordService.getByPlayer(21);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith({
                where: { playerId: 21 },
            });
            expect(result).toEqual([]);
        });
    });

    describe('getForYearByPlayer', () => {
        it('should retrieve the correct PlayerRecord for Player ID 12 and Year 2021', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(
                defaultPlayerRecord,
            );
            const result = await playerRecordService.getForYearByPlayer(
                12,
                2021,
            );
            expect(result).toEqual(defaultPlayerRecord);
            expect(prisma.playerRecord.findFirst).toHaveBeenCalledTimes(1);
        });

        it('should return a zero-record when the player exists but has no record for the year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(null);
            (prisma.player.findUnique as Mock).mockResolvedValue({ id: 12 });

            const result = await playerRecordService.getForYearByPlayer(
                2021,
                12,
            );

            expect(result).toMatchObject({
                id: 0,
                playerId: 12,
                year: 2021,
                gamesPlayed: 0,
                gameDayId: 0,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                points: null,
                scorePoints: 0,
            });
        });

        it('should return null when neither a record nor the player exists', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(null);
            (prisma.player.findUnique as Mock).mockResolvedValue(null);

            const result = await playerRecordService.getForYearByPlayer(
                2021,
                99,
            );

            expect(result).toBeNull();
        });
    });

    describe('getWinners', () => {
        beforeEach(() => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([
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

            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>(
                'services/data/PlayerRecord.test.json',
            );

            (prisma.playerRecord.findMany as Mock).mockImplementation(() => {
                const playerRecords = defaultPlayerRecordList.filter(
                    (playerRecord) =>
                        playerRecord.rankPoints === 1 &&
                        playerRecord.year !== 0,
                );
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve all the winners for the points table for all years', async () => {
            const result = await playerRecordService.getWinners(
                TableNameSchema.enum.points,
            );
            expect(result).toHaveLength(2);
            expect(result[0].year).toBe(2023);
            expect(result[1].playerId).toBe(191);
        });

        it('should retrieve all the winners for the points table for a specific year', async () => {
            const result = await playerRecordService.getWinners(
                TableNameSchema.enum.points,
                2023,
            );
            expect(result).toHaveLength(2);
            expect(result[0].year).toBe(2023);
            expect(result[1].playerId).toBe(191);
        });

        it('should return an empty list when there are no season-ending games', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([]);
            const result = await playerRecordService.getWinners(
                TableNameSchema.enum.points,
            );
            expect(result).toEqual([]);
        });

        it('should filter by player when a player ID is provided', async () => {
            await playerRecordService.getWinners(
                TableNameSchema.enum.points,
                undefined,
                191,
            );
            expect(prisma.playerRecord.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        playerId: 191,
                    }) as unknown,
                }),
            );
        });
    });

    describe('getTable', () => {
        beforeEach(() => {
            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>(
                'services/data/PlayerRecord.test.json',
            );

            (prisma.playerRecord.findMany as Mock).mockImplementation(
                (args: {
                    where: {
                        gameDayId: number;
                        year: number;
                        rankPoints?: {
                            not: null;
                        };
                    };
                    take: number;
                }) => {
                    const playerRecords = defaultPlayerRecordList.filter(
                        (playerRecord) =>
                            playerRecord.year === args.where.year &&
                            playerRecord.gameDayId == args.where.gameDayId &&
                            (!args.where.rankPoints ||
                                playerRecord.rankPoints != null),
                    );
                    return Promise.resolve(playerRecords);
                },
            );
        });

        it('should retrieve the correct PlayerRecords for the points table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.points,
                2022,
            );
            expect(result).toHaveLength(18);
        });

        it('should retrieve the same PlayerRecords for the points table when qualified is set explicitly for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.points,
                2022,
                true,
            );
            expect(result).toHaveLength(18);
        });

        it('should retrieve the correct PlayerRecords for the points table for all time', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1153,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.points,
                0,
            );
            expect(result).toHaveLength(179);
        });

        it('should return an empty list when retrieving the points table for a year with no PlayerRecords', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({});
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.points,
                2010,
            );
            expect(result).toHaveLength(0);
        });

        it('should return an empty list when retrieving the points table for a year that does not exist', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(null);
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.points,
                1984,
            );
            expect(result).toHaveLength(0);
        });
    });

    describe('getTable qualified/unqualified averages', () => {
        beforeEach(() => {
            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>(
                'services/data/PlayerRecord.test.json',
            );

            (prisma.playerRecord.findMany as Mock).mockImplementation(
                (args: {
                    where: {
                        gameDayId: number;
                        year: number;
                        rankAverages?: {
                            not: null;
                        };
                        rankAveragesUnqualified?: {
                            not: null;
                        };
                    };
                    take: number;
                }) => {
                    const playerRecords = defaultPlayerRecordList.filter(
                        (playerRecord) =>
                            playerRecord.year === args.where.year &&
                            playerRecord.gameDayId == args.where.gameDayId &&
                            (!args.where.rankAverages ||
                                playerRecord.rankAverages != null) &&
                            (!args.where.rankAveragesUnqualified ||
                                playerRecord.rankAveragesUnqualified != null),
                    );
                    return Promise.resolve(playerRecords);
                },
            );
        });

        it('should retrieve the correct PlayerRecords for the qualified averages table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.averages,
                2022,
                true,
            );
            expect(result).toHaveLength(0);
        });

        it('should retrieve the correct PlayerRecords for the unqualified averages table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.averages,
                2022,
                false,
            );
            expect(result).toHaveLength(18);
        });
    });

    describe('getTable qualified/unqualified speedy', () => {
        beforeEach(() => {
            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>(
                'services/data/PlayerRecord.test.json',
            );

            (prisma.playerRecord.findMany as Mock).mockImplementation(
                (args: {
                    where: {
                        gameDayId: number;
                        year: number;
                        rankSpeedy?: {
                            not: null;
                        };
                        rankSpeedyUnqualified?: {
                            not: null;
                        };
                    };
                    take: number;
                }) => {
                    const playerRecords = defaultPlayerRecordList.filter(
                        (playerRecord) =>
                            playerRecord.year === args.where.year &&
                            playerRecord.gameDayId == args.where.gameDayId &&
                            (!args.where.rankSpeedy ||
                                playerRecord.rankSpeedy != null) &&
                            (!args.where.rankSpeedyUnqualified ||
                                playerRecord.rankSpeedyUnqualified != null),
                    );
                    return Promise.resolve(playerRecords);
                },
            );
        });

        it('should retrieve the correct PlayerRecords for the qualified speedy table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.speedy,
                2022,
                true,
            );
            expect(result).toHaveLength(12);
        });

        it('should retrieve the correct PlayerRecords for the unqualified speedy table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.speedy,
                2022,
                false,
            );
            expect(result).toHaveLength(10);
        });

        it('should return empty array and not query player records when qualified flag is used for points table', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                gameDayId: 1087,
            });
            const result = await playerRecordService.getTable(
                TableNameSchema.enum.points,
                2022,
                false,
            );
            expect(prisma.playerRecord.findMany).toHaveBeenCalledTimes(0);
            expect(result).toHaveLength(0);
        });
    });

    describe('create', () => {
        it('should create an PlayerRecord', async () => {
            const record = {
                ...defaultPlayerRecord,
                playerId: 12,
                gameDayId: 132,
                scorePoints: 80,
            };
            (prisma.playerRecord.create as Mock).mockResolvedValueOnce(record);
            const result = await playerRecordService.create(record);
            expect(prisma.playerRecord.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        playerId: 12,
                        gameDayId: 132,
                        scorePoints: 80,
                    }) as unknown,
                }) as unknown,
            );
            expect(result).toEqual(record);
        });

        it('should refuse to create an PlayerRecord with invalid data', async () => {
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    year: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    responses: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    played: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    won: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    drawn: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    lost: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    scorePoints: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    points: -1 as unknown as 0 | 1 | 3,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    scoreAverages: -1.0,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    scoreStalwart: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    scorePub: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    rankPoints: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    rankAverages: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    rankStalwart: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    rankSpeedy: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    rankPub: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    scoreSpeedy: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    gameDayId: -1,
                }),
            ).rejects.toThrow();
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    playerId: -1,
                }),
            ).rejects.toThrow();
        });

        it('should refuse to create an PlayerRecord that has the same Player ID, year and GameDay ID as an existing one', async () => {
            (prisma.playerRecord.create as Mock).mockRejectedValueOnce(
                new Error('PlayerRecord already exists'),
            );
            await expect(
                playerRecordService.create({
                    ...defaultPlayerRecord,
                    playerId: 12,
                    year: 2021,
                    gameDayId: 15,
                }),
            ).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a playerRecord where the combination of Player ID, year and GameDay ID did not exist', async () => {
            (prisma.playerRecord.upsert as Mock).mockResolvedValueOnce(
                defaultPlayerRecord,
            );
            const result =
                await playerRecordService.upsert(defaultPlayerRecord);
            expect(prisma.playerRecord.upsert).toHaveBeenCalledWith({
                where: {
                    playerId_year_gameDayId: {
                        playerId: defaultPlayerRecord.playerId,
                        year: defaultPlayerRecord.year,
                        gameDayId: defaultPlayerRecord.gameDayId,
                    },
                },
                create: expect.objectContaining({
                    playerId: defaultPlayerRecord.playerId,
                    year: defaultPlayerRecord.year,
                    gameDayId: defaultPlayerRecord.gameDayId,
                }) as unknown,
                update: expect.objectContaining({
                    playerId: defaultPlayerRecord.playerId,
                    year: defaultPlayerRecord.year,
                    gameDayId: defaultPlayerRecord.gameDayId,
                }) as unknown,
            });
            expect(result).toEqual(defaultPlayerRecord);
        });

        it('should update an existing PlayerRecord where the combination of Player ID, year and GameDay ID already existed', async () => {
            const updatedPlayerRecord = {
                ...defaultPlayerRecord,
                playerId: 12,
                year: 2021,
                gameDayId: 15,
                scorePoints: 23,
            };
            (prisma.playerRecord.upsert as Mock).mockResolvedValueOnce(
                updatedPlayerRecord,
            );
            const result =
                await playerRecordService.upsert(updatedPlayerRecord);
            expect(prisma.playerRecord.upsert).toHaveBeenCalledWith({
                where: {
                    playerId_year_gameDayId: {
                        playerId: 12,
                        year: 2021,
                        gameDayId: 15,
                    },
                },
                create: expect.objectContaining({
                    playerId: 12,
                    year: 2021,
                    gameDayId: 15,
                    scorePoints: 23,
                }) as unknown,
                update: expect.objectContaining({
                    playerId: 12,
                    year: 2021,
                    gameDayId: 15,
                    scorePoints: 23,
                }) as unknown,
            });
            expect(result).toEqual(updatedPlayerRecord);
        });
    });

    describe('upsertForGameDay with few-response players', () => {
        it('should assign rankSpeedyUnqualified for players with fewer than 10 responses', async () => {
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                {
                    id: 1,
                    date: new Date('2022-01-03'),
                    status: 'AWin',
                    mailSent: new Date('2022-01-01'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(1);

            // 5 players with only 3 responses each (below minRepliesForSpeedyTable=10)
            (prisma.outcome.findMany as Mock).mockResolvedValue(
                Array.from({ length: 5 }, (_, i) => ({
                    gameDayId: 1,
                    playerId: i + 1,
                    response: 'Yes',
                    responseInterval: (i + 1) * 500,
                    team: i % 2 === 0 ? 'A' : 'B',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                })),
            );

            const result = await playerRecordService.upsertForGameDay(1);
            expect(result.length).toBeGreaterThan(0);
            const yearRecord = result.find((r) => r.year === 2022);
            expect(yearRecord).toBeDefined();
            expect(yearRecord?.rankSpeedyUnqualified).not.toBeNull();
            expect(yearRecord?.rankSpeedy).toBeNull();
        });
    });

    describe('upsertForGameDay with an outcome referencing an unknown GameDay', () => {
        it('should throw InternalError rather than silently treating a missing status as decided', async () => {
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );
            // Only GameDay 1 is known...
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                {
                    id: 1,
                    date: new Date('2022-01-03'),
                    status: 'AWin',
                    mailSent: new Date('2022-01-01'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(1);

            // ...but the outcome references GameDay 2, which is missing from
            // the status map built from the list above.
            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 2,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 500,
                    team: 'A',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                },
            ]);

            await expect(
                playerRecordService.upsertForGameDay(1),
            ).rejects.toBeInstanceOf(InternalError);
        });
    });

    describe('upsertForGameDay with an unplayed player mixed in', () => {
        it("should rank a scored player correctly and leave an unscored player's ranks unset, not null/NaN", async () => {
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                {
                    id: 1,
                    date: new Date('2022-01-03'),
                    status: 'AWin',
                    mailSent: new Date('2022-01-01'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(1);

            (prisma.outcome.findMany as Mock).mockResolvedValue([
                // Player 1 played and won — has real scorePoints/scoreAverages/
                // scoreStalwart/scoreSpeedy values.
                {
                    gameDayId: 1,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 500,
                    team: 'A',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                },
                // Player 2 responded but never played and gave no response
                // interval — played/scorePoints/scoreAverages/scoreStalwart/
                // scoreSpeedy are all left unset (undefined, not null) on
                // their record.
                {
                    gameDayId: 1,
                    playerId: 2,
                    response: 'No',
                    responseInterval: null,
                    team: null,
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                },
            ]);

            const result = await playerRecordService.upsertForGameDay(1);
            const player1 = result.find(
                (r) => r.year === 2022 && r.playerId === 1,
            );
            const player2 = result.find(
                (r) => r.year === 2022 && r.playerId === 2,
            );

            expect(player1?.rankPoints).toBe(1);
            expect(player1?.rankStalwart).toBe(1);
            expect(player1?.rankSpeedyUnqualified).toBe(1);
            expect(Number.isNaN(player1?.rankPoints)).toBe(false);
            expect(Number.isNaN(player1?.rankStalwart)).toBe(false);
            expect(Number.isNaN(player1?.rankSpeedyUnqualified)).toBe(false);

            // Player 2 never qualifies for the ranking `if` guards at all
            // (their score fields are unset, not null), so these stay
            // unassigned rather than being written as null.
            expect(player2?.rankPoints).toBeUndefined();
            expect(player2?.rankStalwart).toBeUndefined();
            expect(player2?.rankSpeedy).toBeUndefined();
            expect(player2?.rankSpeedyUnqualified).toBeUndefined();
        });
    });

    describe('upsertForGameDay with a qualified-averages player', () => {
        it('should assign rankAverages once a player reaches minGamesForAveragesTable played games', async () => {
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );
            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                Array.from({ length: 10 }, (_, i) => ({
                    id: i + 1,
                    date: new Date('2022-01-03'),
                    status: 'AWin',
                    mailSent: new Date('2022-01-01'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                })),
            );
            (prisma.gameDay.count as Mock).mockResolvedValue(10);

            // Two players who both reach played = 10 =
            // config.minGamesForAveragesTable on the last game day, one on
            // the winning team throughout and one on the losing team — this
            // keeps the qualified averagesArray at length >= 2 so its sort
            // comparator actually runs.
            (prisma.outcome.findMany as Mock).mockResolvedValue(
                Array.from({ length: 10 }, (_, i) => [
                    {
                        gameDayId: i + 1,
                        playerId: 1,
                        response: 'Yes',
                        responseInterval: 500,
                        team: 'A',
                        pub: null,
                        paid: false,
                        goalie: false,
                        gameDay: { status: 'AWin' },
                    },
                    {
                        gameDayId: i + 1,
                        playerId: 2,
                        response: 'Yes',
                        responseInterval: 500,
                        team: 'B',
                        pub: null,
                        paid: false,
                        goalie: false,
                        gameDay: { status: 'AWin' },
                    },
                ]).flat(),
            );

            const result = await playerRecordService.upsertForGameDay();
            const winnerRecord = result.find(
                (r) =>
                    r.year === 2022 && r.gameDayId === 10 && r.playerId === 1,
            );
            const loserRecord = result.find(
                (r) =>
                    r.year === 2022 && r.gameDayId === 10 && r.playerId === 2,
            );
            expect(winnerRecord?.played).toBe(10);
            expect(loserRecord?.played).toBe(10);
            expect(winnerRecord?.rankAverages).toBe(1);
            expect(loserRecord?.rankAverages).toBe(2);
            expect(winnerRecord?.rankAveragesUnqualified).toBeNull();
            expect(loserRecord?.rankAveragesUnqualified).toBeNull();
        });
    });

    describe('upsertForGameDay with no-points outcomes', () => {
        it('should not set points or averages when a player has only null-points outcomes', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                {
                    id: 1,
                    date: new Date('2022-01-03'),
                    status: 'Scheduled',
                    mailSent: new Date('2022-01-01'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(1);

            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 1,
                    playerId: 1,
                    response: 'No',
                    responseInterval: null,
                    team: null,
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'Scheduled' },
                },
            ]);

            await playerRecordService.upsertForGameDay(1);
            const upsertCalls = (prisma.playerRecord.upsert as Mock).mock.calls;
            const relevantCall = upsertCalls.find(
                (call) =>
                    (call[0] as { create: { playerId: number } }).create
                        .playerId === 1,
            );
            expect(relevantCall).toBeDefined();
            // When a player has only null-points outcomes, played/scorePoints/
            // scoreAverages are not set, but the single-game points field is
            // still set explicitly to null (there's no result for this game).
            expect(
                (relevantCall![0] as { create: { played?: number } }).create
                    .played,
            ).toBeUndefined();
            expect(
                (relevantCall![0] as { create: { points: number | null } })
                    .create.points,
            ).toBeNull();
            expect(
                (
                    relevantCall![0] as {
                        create: { scorePoints?: number };
                    }
                ).create.scorePoints,
            ).toBeUndefined();
            expect(
                (
                    relevantCall![0] as {
                        create: { scoreAverages?: number };
                    }
                ).create.scoreAverages,
            ).toBeUndefined();
        });
    });

    describe('upsertForGameDay for known GameDay with no outcomes', () => {
        beforeEach(() => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValue({
                id: 15,
                date: new Date('2021-01-03'),
                status: 'Scheduled',
                mailSent: new Date('2021-01-01'),
                comment: 'I heart footy',
                bibs: 'A',
                pickerGamesHistory: 10,
            });

            (prisma.gameDay.findMany as Mock).mockResolvedValue([]);
        });

        it('should not create PlayerRecords for a GameDay with no outcomes', async () => {
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });
    });

    describe('upsertForGameDay for known GameDay with outcomes', () => {
        beforeEach(() => {
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );
            (prisma.gameDay.findUnique as Mock).mockResolvedValue({
                id: 15,
                date: new Date('2022-01-03'),
                status: 'Scheduled',
                mailSent: new Date('2022-01-01'),
                comment: 'I heart footy',
                bibs: 'A',
                pickerGamesHistory: 10,
            });

            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                Array.from({ length: 15 }, (_, index) => ({
                    id: index + 1,
                    date:
                        index < 11
                            ? new Date('2021-01-03')
                            : new Date('2022-01-03'),
                    status: 'Scheduled',
                    mailSent:
                        index < 11
                            ? new Date('2021-01-01')
                            : new Date('2022-01-01'),
                    comment: 'I heart footy',
                    bibs: 'A',
                    pickerGamesHistory: 10,
                })),
            );

            (prisma.gameDay.count as Mock).mockResolvedValue(15);

            (prisma.outcome.findMany as Mock).mockResolvedValue(
                Array.from({ length: 150 }, (_, index) => ({
                    gameDayId: Math.floor(index / 10) + 1,
                    playerId: (index % 10) + 1,
                    response: index < 141 ? 'Yes' : 'No',
                    responseInterval: index != 100 ? 3000 : null,
                    team: index < 141 ? (index % 2 ? 'A' : 'B') : null,
                    pub: index % 2 ? 1 : null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'Scheduled' },
                })),
            );
        });

        it('should create or update all PlayerRecords for a given GameDay', async () => {
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toHaveLength(20);
        });

        it('should create or update all PlayerRecords for every GameDay', async () => {
            const result = await playerRecordService.upsertForGameDay();
            expect(result).toHaveLength(300);
        });

        it('should do nothing if no Outcomes exist for the given GameDay', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValue([]);
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });

        it('should update the table ranks for all PlayerRecords with GameDays on or after the given GameDay', async () => {
            await playerRecordService.upsertForGameDay(15);
            expect(prisma.playerRecord.upsert).toHaveBeenCalledTimes(20);
        });

        it('should set values for both the year the game took place and for all time (year 0)', async () => {
            const result = await playerRecordService.upsertForGameDay(15);
            expect(prisma.playerRecord.upsert).toHaveBeenCalledTimes(20);
            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        year: 2022,
                    }),
                    expect.objectContaining({
                        year: 0,
                    }),
                ]),
            );
        });

        it('should do nothing if there are no game days', async () => {
            (prisma.gameDay.findMany as Mock).mockResolvedValue([]);
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });

        it('should do nothing if there are no outcomes', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValue([]);
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });
    });

    /**
     * Asserts that rank values in `records` are consistent with the corresponding
     * score values: sorting by rank ascending must produce scores in non-increasing
     * order (for highScoreWins=true) or non-decreasing order (for speedy tables
     * where a lower response time is better). Tied ranks are only allowed when
     * the tied players share the same score.
     */
    function expectRankMatchesOrder(
        records: PlayerRecordType[],
        scoreField: keyof PlayerRecordType,
        rankField: keyof PlayerRecordType,
        highScoreWins = true,
    ) {
        const ranked = records
            .filter((r) => r[rankField] != null && r[scoreField] != null)
            .sort((a, b) => a[rankField]! - b[rankField]!);

        for (let i = 0; i < ranked.length - 1; i++) {
            const scoreA = ranked[i][scoreField]!;
            const scoreB = ranked[i + 1][scoreField]!;
            const rankA = ranked[i][rankField]!;
            const rankB = ranked[i + 1][rankField]!;
            if (rankA === rankB) {
                expect(scoreA).toBe(scoreB);
            } else if (highScoreWins) {
                expect(scoreA).toBeGreaterThanOrEqual(scoreB);
            } else {
                expect(scoreA).toBeLessThanOrEqual(scoreB);
            }
        }
    }

    describe('upsertFromGameDay', () => {
        it('bootstraps state from DB and processes game days from the changed game onward', async () => {
            const fromDate = new Date('2024-01-10T00:00:00Z');
            const getSpy = vi
                .spyOn(gameDayService, 'get')
                .mockResolvedValueOnce({
                    id: 2,
                    year: 2024,
                    date: fromDate,
                    status: 'Draw',
                    mailSent: new Date('2024-01-08T09:00:00Z'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                    cost: 450,
                    hallCost: 5000,
                });
            const getAllSpy = vi
                .spyOn(gameDayService, 'getAll')
                .mockResolvedValue([
                    {
                        id: 2,
                        year: 2024,
                        date: fromDate,
                        status: 'Draw',
                        mailSent: new Date('2024-01-08T09:00:00Z'),
                        comment: null,
                        bibs: 'A',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                ]);

            // Player 99 has history before game day 2; player 1 plays on game day 2.
            const player99AllTime = createMockPlayerRecord({
                playerId: 99,
                year: 0,
                gameDayId: 1,
                played: 5,
                scoreAverages: 1.5,
            });
            const player99Year = createMockPlayerRecord({
                playerId: 99,
                year: 2024,
                gameDayId: 1,
                played: 5,
                scoreAverages: 1.5,
            });

            (prisma.playerRecord.groupBy as Mock)
                .mockResolvedValueOnce([
                    { playerId: 99, _max: { gameDayId: 1 } },
                ])
                .mockResolvedValueOnce([
                    { playerId: 99, _max: { gameDayId: 1 } },
                ]);
            (prisma.playerRecord.findMany as Mock)
                .mockResolvedValueOnce([player99AllTime])
                .mockResolvedValueOnce([player99Year]);

            // Each outcome.findMany call receives only the data it would see in
            // production: getAllForYear(0) and getAllForYear(2024) return all
            // outcomes for the year; getByGameDay(2) returns only the outcomes
            // for players who actually played on game day 2 (player 1). Player
            // 99 played game day 1, not game day 2, so they must reach the
            // result exclusively via the bootstrap — the core invariant this test
            // protects.
            const allOutcomes = [
                {
                    gameDayId: 1,
                    playerId: 99,
                    response: 'Yes',
                    responseInterval: 1000,
                    team: 'A',
                    pub: null,
                    paid: false,
                    goalie: false,
                },
                {
                    gameDayId: 2,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 2000,
                    team: 'B',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'Draw' },
                },
            ];
            (prisma.outcome.findMany as Mock)
                .mockResolvedValueOnce(allOutcomes) // getAllForYear(0)
                .mockResolvedValueOnce(allOutcomes) // getAllForYear(2024)
                .mockResolvedValueOnce([allOutcomes[1]]); // getByGameDay(2): only player 1
            (prisma.gameDay.count as Mock).mockResolvedValue(2);
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );

            const result = await playerRecordService.upsertFromGameDay(2);

            expect(getSpy).toHaveBeenCalledWith(2);
            expect(getAllSpy).toHaveBeenCalledWith();
            // Both the all-time and per-year bootstrap queries must run.
            expect(prisma.playerRecord.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { year: 0, gameDayId: { lt: 2 } },
                }),
            );
            expect(prisma.playerRecord.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { year: 2024, gameDayId: { lt: 2 } },
                }),
            );
            // Both the bootstrapped historical player and the player who played
            // on game day 2 should appear in the result.
            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ playerId: 99 }),
                    expect.objectContaining({ playerId: 1 }),
                ]),
            );
            // Player 99 (bootstrapped: scorePoints=18, scoreAverages=1.5) must
            // rank above player 1 (computed: scorePoints=1, scoreAverages=1.0).
            // Without a proper bootstrap these checks would also fail because
            // player 99 would not appear in the result at all.
            const year2024 = result.filter((r) => r.year === 2024);
            expectRankMatchesOrder(year2024, 'scorePoints', 'rankPoints');
            expectRankMatchesOrder(
                year2024,
                'scoreAverages',
                'rankAveragesUnqualified',
            );
            expect(prisma.playerRecord.deleteMany).not.toHaveBeenCalled();

            getSpy.mockRestore();
            getAllSpy.mockRestore();
        });

        it('excludes future game days from processing', async () => {
            const pastDate = new Date('2024-01-10T00:00:00Z');
            const futureDate = new Date('2099-12-31T00:00:00Z');

            const getSpy = vi
                .spyOn(gameDayService, 'get')
                .mockResolvedValueOnce({
                    id: 2,
                    year: 2024,
                    date: pastDate,
                    status: 'AWin',
                    mailSent: new Date('2024-01-08T09:00:00Z'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                    cost: 450,
                    hallCost: 5000,
                });
            const getAllSpy = vi
                .spyOn(gameDayService, 'getAll')
                .mockResolvedValue([
                    {
                        id: 2,
                        year: 2024,
                        date: pastDate,
                        status: 'AWin',
                        mailSent: new Date('2024-01-08T09:00:00Z'),
                        comment: null,
                        bibs: 'A',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                    {
                        id: 3,
                        year: 2024,
                        date: futureDate,
                        status: 'Scheduled',
                        mailSent: new Date('2099-12-29T09:00:00Z'),
                        comment: null,
                        bibs: 'B',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                ]);

            (prisma.playerRecord.groupBy as Mock).mockResolvedValue([]);
            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 2,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 1000,
                    team: 'A',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(1);
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );

            const result = await playerRecordService.upsertFromGameDay(2);

            // getAllForYear(0) + getAllForYear(2024) + getByGameDay(2) = 3 calls.
            // A fourth call would mean getByGameDay(3) ran, i.e. the future day
            // was processed.
            expect(prisma.outcome.findMany).toHaveBeenCalledTimes(3);
            // Game day 2 was still processed — result is non-empty.
            expect(result.length).toBeGreaterThan(0);
            // No record should be pinned to the future game day.
            expect(result).not.toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ gameDayId: 3 }),
                ]),
            );

            getSpy.mockRestore();
            getAllSpy.mockRestore();
        });

        it('accumulates state across multiple game days in the same year', async () => {
            const date2 = new Date('2024-01-10T00:00:00Z');
            const date3 = new Date('2024-01-17T00:00:00Z');

            const getSpy = vi
                .spyOn(gameDayService, 'get')
                .mockResolvedValueOnce({
                    id: 2,
                    year: 2024,
                    date: date2,
                    status: 'AWin',
                    mailSent: new Date('2024-01-08T09:00:00Z'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                    cost: 450,
                    hallCost: 5000,
                });
            const getAllSpy = vi
                .spyOn(gameDayService, 'getAll')
                .mockResolvedValue([
                    {
                        id: 2,
                        year: 2024,
                        date: date2,
                        status: 'AWin',
                        mailSent: new Date('2024-01-08T09:00:00Z'),
                        comment: null,
                        bibs: 'A',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                    {
                        id: 3,
                        year: 2024,
                        date: date3,
                        status: 'Draw',
                        mailSent: new Date('2024-01-15T09:00:00Z'),
                        comment: null,
                        bibs: 'B',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                ]);

            (prisma.playerRecord.groupBy as Mock).mockResolvedValue([]);
            // Player 1 plays on game day 2; player 2 plays on game day 3.
            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 2,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 1000,
                    team: 'A',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                },
                {
                    gameDayId: 3,
                    playerId: 2,
                    response: 'Yes',
                    responseInterval: 2000,
                    team: 'B',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'Draw' },
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(2);
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );

            const result = await playerRecordService.upsertFromGameDay(2);

            // getAllForYear(0) + getAllForYear(2024) + getByGameDay(2) + getByGameDay(3) = 4.
            expect(prisma.outcome.findMany).toHaveBeenCalledTimes(4);
            // State from game day 2 carries into game day 3: both players appear.
            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ playerId: 1 }),
                    expect.objectContaining({ playerId: 2 }),
                ]),
            );

            getSpy.mockRestore();
            getAllSpy.mockRestore();
        });

        it('processes game days spanning two calendar years with separate per-year bootstraps', async () => {
            const date2024 = new Date('2024-12-18T00:00:00Z');
            const date2025 = new Date('2025-01-08T00:00:00Z');

            const getSpy = vi
                .spyOn(gameDayService, 'get')
                .mockResolvedValueOnce({
                    id: 50,
                    year: 2024,
                    date: date2024,
                    status: 'AWin',
                    mailSent: new Date('2024-12-16T09:00:00Z'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                    cost: 450,
                    hallCost: 5000,
                });
            const getAllSpy = vi
                .spyOn(gameDayService, 'getAll')
                .mockResolvedValue([
                    {
                        id: 50,
                        year: 2024,
                        date: date2024,
                        status: 'AWin',
                        mailSent: new Date('2024-12-16T09:00:00Z'),
                        comment: null,
                        bibs: 'A',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                    {
                        id: 51,
                        year: 2025,
                        date: date2025,
                        status: 'Scheduled',
                        mailSent: new Date('2025-01-06T09:00:00Z'),
                        comment: null,
                        bibs: 'B',
                        pickerGamesHistory: 10,
                        cost: 450,
                        hallCost: 5000,
                    },
                ]);

            (prisma.playerRecord.groupBy as Mock).mockResolvedValue([]);
            (prisma.outcome.findMany as Mock).mockResolvedValue([
                {
                    gameDayId: 50,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 1000,
                    team: 'A',
                    pub: null,
                    paid: false,
                    goalie: false,
                    gameDay: { status: 'AWin' },
                },
            ]);
            (prisma.gameDay.count as Mock).mockResolvedValue(1);
            (prisma.playerRecord.upsert as Mock).mockImplementation(
                (args: { create: unknown }) => Promise.resolve(args.create),
            );

            const result = await playerRecordService.upsertFromGameDay(50);

            // Bootstrap must run separately for all-time, 2024, and 2025.
            expect(prisma.playerRecord.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { year: 0, gameDayId: { lt: 50 } },
                }),
            );
            expect(prisma.playerRecord.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { year: 2024, gameDayId: { lt: 50 } },
                }),
            );
            expect(prisma.playerRecord.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { year: 2025, gameDayId: { lt: 50 } },
                }),
            );
            // Records for both calendar years and all-time must appear.
            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ year: 2024 }),
                    expect.objectContaining({ year: 2025 }),
                    expect.objectContaining({ year: 0 }),
                ]),
            );

            getSpy.mockRestore();
            getAllSpy.mockRestore();
        });

        it('returns no records when the game day does not exist', async () => {
            const getSpy = vi
                .spyOn(gameDayService, 'get')
                .mockResolvedValueOnce(null);
            const getAllSpy = vi.spyOn(gameDayService, 'getAll');

            const result = await playerRecordService.upsertFromGameDay(9999);

            expect(result).toEqual([]);
            expect(getSpy).toHaveBeenCalledWith(9999);
            expect(getAllSpy).not.toHaveBeenCalled();
            getSpy.mockRestore();
            getAllSpy.mockRestore();
        });

        it('returns no records when getAll returns no game days', async () => {
            const fromDate = new Date('2024-01-10T00:00:00Z');
            const getSpy = vi
                .spyOn(gameDayService, 'get')
                .mockResolvedValueOnce({
                    id: 2,
                    year: 2024,
                    date: fromDate,
                    status: 'AWin',
                    mailSent: new Date('2024-01-08T09:00:00Z'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                    cost: 450,
                    hallCost: 5000,
                });
            const getAllSpy = vi
                .spyOn(gameDayService, 'getAll')
                .mockResolvedValueOnce([]);

            const result = await playerRecordService.upsertFromGameDay(2);

            expect(result).toEqual([]);
            expect(getSpy).toHaveBeenCalledWith(2);
            expect(getAllSpy).toHaveBeenCalledWith();
            getSpy.mockRestore();
            getAllSpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('should delete an existing PlayerRecord', async () => {
            (prisma.playerRecord.delete as Mock).mockResolvedValueOnce(
                defaultPlayerRecord,
            );
            await playerRecordService.delete(12, 2021, 15);
            expect(prisma.playerRecord.delete).toHaveBeenCalledWith({
                where: {
                    playerId_year_gameDayId: {
                        playerId: 12,
                        year: 2021,
                        gameDayId: 15,
                    },
                },
            });
        });

        it('should silently return when asked to delete an PlayerRecord that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.playerRecord.delete as Mock).mockRejectedValueOnce(
                notFoundError,
            );
            await playerRecordService.delete(16, 2022, 7);
            expect(prisma.playerRecord.delete).toHaveBeenCalledTimes(1);
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.playerRecord.delete as Mock).mockRejectedValueOnce(
                new Error('db exploded'),
            );
            await expect(
                playerRecordService.delete(12, 2021, 15),
            ).rejects.toThrow('db exploded');
        });
    });

    describe('deleteAll', () => {
        it('should delete all PlayerRecords', async () => {
            (prisma.playerRecord.deleteMany as Mock).mockResolvedValueOnce({
                count: 0,
            });
            await playerRecordService.deleteAll();
            expect(prisma.playerRecord.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

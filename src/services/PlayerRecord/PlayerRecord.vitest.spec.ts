import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { TableNameSchema } from 'prisma/zod/schemas';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import gameDayService from '@/services/GameDay';
import playerRecordService from '@/services/PlayerRecord';
import {
    createMockPlayerRecord,
    defaultPlayerRecord,
    defaultPlayerRecordList,
} from '@/tests/mocks/data/playerRecord';
import { loadJsonFixture } from '@/tests/shared/fixtures';



describe('PlayerRecordService', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (prisma.playerRecord.findUnique as Mock).mockImplementation((args: {
            where: {
                playerId_year_gameDayId: {
                    playerId: number,
                    year: number,
                    gameDayId: number,
                }
            }
        }) => {
            const playerRecord = defaultPlayerRecordList.find((record) =>
                record.playerId === args.where.playerId_year_gameDayId.playerId &&
                record.year === args.where.playerId_year_gameDayId.year &&
                record.gameDayId === args.where.playerId_year_gameDayId.gameDayId,
            );
            return Promise.resolve(playerRecord ?? null);
        });

        (prisma.playerRecord.findMany as Mock).mockImplementation((args: {
            where: {
                gameDayId: number,
                year: number,
                playerId: number,
            },
            take: number,
            orderBy: { responseInterval: 'desc' }
        }) => {
            return Promise.resolve(defaultPlayerRecordList.filter((playerRecord) =>
                playerRecord.playerId === args.where.playerId &&
                playerRecord.year === args.where.year &&
                playerRecord.gameDayId < args.where.gameDayId).slice(0, args.take,
            ));
        });

        (prisma.playerRecord.create as Mock).mockImplementation((args: {
            data: Partial<PlayerRecordType> & {
                playerId: number,
                year: number,
                gameDayId: number,
            }
        }) => {
            const playerRecord = defaultPlayerRecordList.find((record) =>
                record.playerId === args.data.playerId &&
                record.year === args.data.year &&
                record.gameDayId === args.data.gameDayId,
            );

            if (playerRecord) {
                return Promise.reject(new Error('PlayerRecord already exists'));
            }
            else {
                return Promise.resolve(createMockPlayerRecord(args.data));
            }
        });

        (prisma.playerRecord.upsert as Mock).mockImplementation((args: {
            where: {
                playerId_year_gameDayId: {
                    playerId: number,
                    year: number,
                    gameDayId: number,
                }
            },
            update: Partial<PlayerRecordType>,
            create: Partial<PlayerRecordType>,
        }) => {
            const playerRecord = defaultPlayerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.where.playerId_year_gameDayId.playerId &&
                playerRecord.year === args.where.playerId_year_gameDayId.year &&
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId,
            );

            if (playerRecord) {
                return Promise.resolve(createMockPlayerRecord(args.update));
            }
            else {
                return Promise.resolve(createMockPlayerRecord(args.create));
            }
        });

        (prisma.playerRecord.delete as Mock).mockImplementation((args: {
            where: {
                playerId_year_gameDayId: {
                    playerId: number,
                    year: number,
                    gameDayId: number,
                }
            }
        }) => {
            const playerRecord = defaultPlayerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.where.playerId_year_gameDayId.playerId &&
                playerRecord.year === args.where.playerId_year_gameDayId.year &&
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId,
            );
            return Promise.resolve(playerRecord ?? null);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct PlayerRecord for Player 12, Year 2021 and GameDay 15', async () => {
            const result = await playerRecordService.get(12, 2021, 15);
            expect(result).toMatchObject({
                ...defaultPlayerRecord,
                gameDayId: 15,
                playerId: 12,
            } as PlayerRecordType);
            expect(typeof result?.points).toBe('number');
        });

        it('should return null for Player 16, Year 2022, GameDay 7', async () => {
            const result = await playerRecordService.get(16, 2022, 7);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.playerRecord.findMany as Mock).mockImplementation(() => {
                return Promise.resolve(defaultPlayerRecordList);
            });
        });

        it('should retrieve all PlayerRecords', async () => {
            const result = await playerRecordService.getAll();
            const expected = defaultPlayerRecordList;
            expect(result).toHaveLength(expected.length);
            expect(result).toEqual(expected);
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

            const result = await playerRecordService.getAllYears();
            expect(result).toEqual([2021, 0]);
        });

        it('should include an in-progress current year by default', async () => {
            (prisma.gameDay.groupBy as Mock).mockImplementation((args: {
                where?: {
                    date?: {
                        lte?: Date,
                    },
                },
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
            });

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

            const result = await playerRecordService.getAllYears();
            expect(result).toEqual([2026, 0]);
        });

        it('should exclude an in-progress current year when requesting completed seasons only', async () => {
            (prisma.gameDay.groupBy as Mock).mockImplementation((args: {
                where?: {
                    date?: {
                        lte?: Date,
                    },
                },
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
            });

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

            const result = await playerRecordService.getAllYears(true);
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

            const result = await playerRecordService.getAllYears();
            expect(result).toEqual([2021, 2022, 0]);
        });
    });

    describe('getByGameDay', () => {
        beforeEach(() => {
            (prisma.playerRecord.findMany as Mock).mockImplementation((args: { 
                where: { 
                    gameDayId: number;
                    year?: number;
                } 
            }) => {
                return Promise.resolve(defaultPlayerRecordList.filter((playerRecord) => {
                    const matchesGameDay = playerRecord.gameDayId === args.where.gameDayId;
                    const matchesYear = args.where.year === undefined || playerRecord.year === args.where.year;
                    return matchesGameDay && matchesYear;
                }));
            });
        });

        it('should retrieve the correct PlayerRecords for GameDay id 15', async () => {
            const result = await playerRecordService.getByGameDay(15);
            // With varied mock data, gameDayId 15 has 11 records (1 from defaultPlayerRecord + 10 generated)
            expect(result).toHaveLength(11);
            // Verify all have the correct gameDayId
            for (const playerRecordResult of result) {
                expect(playerRecordResult.gameDayId).toBe(15);
                expect(typeof playerRecordResult.playerId).toBe('number');
            }
        });

        it('should retrieve the correct PlayerRecords for GameDay id 15 and year 2021', async () => {
            const result = await playerRecordService.getByGameDay(15, 2021);
            // With varied mock data, only defaultPlayerRecord matches gameDayId=15 and year=2021
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                ...defaultPlayerRecord,
                gameDayId: 15,
                year: 2021,
            } as PlayerRecordType);
        });

        it('should return an empty list when retrieving playerRecords for GameDay id 101', async () => {
            const result = await playerRecordService.getByGameDay(101);
            expect(result).toEqual([]);
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.playerRecord.findMany as Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(defaultPlayerRecordList.filter((playerRecord) => playerRecord.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct PlayerRecords for Player ID 12', async () => {
            const result = await playerRecordService.getByPlayer(12);
            const expected = defaultPlayerRecordList.filter((playerRecord) => playerRecord.playerId === 12);
            expect(result).toHaveLength(expected.length);
            expect(result).toEqual(expected);
        });

        it('should return an empty list when retrieving PlayerRecords for Player id 21', async () => {
            const result = await playerRecordService.getByPlayer(21);
            expect(result).toEqual([]);
        });
    });

    describe('getForYearByPlayer', () => {
        it('should retrieve the correct PlayerRecord for Player ID 12 and Year 2021', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(defaultPlayerRecord);
            const result = await playerRecordService.getForYearByPlayer(12, 2021);
            expect(result).toEqual(defaultPlayerRecord);
            expect(prisma.playerRecord.findFirst).toHaveBeenCalledTimes(1);
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

            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>('services/data/PlayerRecord.test.json');

            (prisma.playerRecord.findMany as Mock).mockImplementation(() => {
                const playerRecords = defaultPlayerRecordList.filter((playerRecord) =>
                    playerRecord.rankPoints === 1 &&
                    playerRecord.year !== 0);
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve all the winners for the points table for all years', async () => {
            const result = await playerRecordService.getWinners(TableNameSchema.enum.points);
            expect(result).toHaveLength(2);
            expect(result[0].year).toBe(2023);
            expect(result[1].playerId).toBe(191);
        });

        it('should retrieve all the winners for the points table for a specific year', async () => {
            const result = await playerRecordService.getWinners(TableNameSchema.enum.points, 2023);
            expect(result).toHaveLength(2);
            expect(result[0].year).toBe(2023);
            expect(result[1].playerId).toBe(191);
        });

        it('should return an empty list when there are no season-ending games', async () => {
            (prisma.gameDay.groupBy as Mock).mockResolvedValue([]);
            const result = await playerRecordService.getWinners(TableNameSchema.enum.points);
            expect(result).toEqual([]);
        });
    });

    describe('getTable', () => {
        beforeEach(() => {
            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>('services/data/PlayerRecord.test.json');

            (prisma.playerRecord.findMany as Mock).mockImplementation((args: {
                where: {
                    gameDayId: number,
                    year: number,
                    rankPoints?: {
                        not: null,
                    },
                },
                take: number
            }) => {
                const playerRecords = defaultPlayerRecordList.filter((playerRecord) =>
                    playerRecord.year === args.where.year &&
                    playerRecord.gameDayId == args.where.gameDayId &&
                    (!args.where.rankPoints || (playerRecord.rankPoints != null)));
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve the correct PlayerRecords for the points table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2022);
            expect(result).toHaveLength(18);
        });

        it('should retrieve the same PlayerRecords for the points table when qualified is set explicitly for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2022, true);
            expect(result).toHaveLength(18);
        });

        it('should retrieve the correct PlayerRecords for the points table for all time', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1153,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 0);
            expect(result).toHaveLength(179);
        });

        it('should return an empty list when retrieving the points table for a year with no PlayerRecords', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({});
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2010);
            expect(result).toHaveLength(0);
        });

        it('should return an empty list when retrieving the points table for a year that does not exist', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue(null);
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 1984);
            expect(result).toHaveLength(0);
        });
    });

    describe('getTable qualified/unqualified averages', () => {
        beforeEach(() => {
            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>('services/data/PlayerRecord.test.json');

            (prisma.playerRecord.findMany as Mock).mockImplementation((args: {
                where: {
                    gameDayId: number,
                    year: number,
                    rankAverages?: {
                        not: null,
                    },
                    rankAveragesUnqualified?: {
                        not: null,
                    },
                },
                take: number
            }) => {
                const playerRecords = defaultPlayerRecordList.filter((playerRecord) =>
                    playerRecord.year === args.where.year &&
                    playerRecord.gameDayId == args.where.gameDayId &&
                    (!args.where.rankAverages || (playerRecord.rankAverages != null)) &&
                    (!args.where.rankAveragesUnqualified || (playerRecord.rankAveragesUnqualified != null)));
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve the correct PlayerRecords for the qualified averages table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.averages, 2022, true);
            expect(result).toHaveLength(0);
        });

        it('should retrieve the correct PlayerRecords for the unqualified averages table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.averages, 2022, false);
            expect(result).toHaveLength(18);
        });
    });

    describe('getTable qualified/unqualified speedy', () => {
        beforeEach(() => {
            const defaultPlayerRecordList = loadJsonFixture<PlayerRecordType[]>('services/data/PlayerRecord.test.json');

            (prisma.playerRecord.findMany as Mock).mockImplementation((args: {
                where: {
                    gameDayId: number,
                    year: number,
                    rankSpeedy?: {
                        not: null,
                    },
                    rankSpeedyUnqualified?: {
                        not: null,
                    },
                },
                take: number
            }) => {
                const playerRecords = defaultPlayerRecordList.filter((playerRecord) =>
                    playerRecord.year === args.where.year &&
                    playerRecord.gameDayId == args.where.gameDayId &&
                    (!args.where.rankSpeedy || (playerRecord.rankSpeedy != null)) &&
                    (!args.where.rankSpeedyUnqualified || (playerRecord.rankSpeedyUnqualified != null)));
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve the correct PlayerRecords for the qualified speedy table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.speedy, 2022, true);
            expect(result).toHaveLength(12);
        });

        it('should retrieve the correct PlayerRecords for the unqualified speedy table for a given year', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.speedy, 2022, false);
            expect(result).toHaveLength(10);
        });

        it('should return empty array and not query player records when qualified flag is used for points table', async () => {
            (prisma.playerRecord.findFirst as Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2022, false);
            expect(prisma.playerRecord.findMany).toHaveBeenCalledTimes(0);
            expect(result).toHaveLength(0);
        });
    });

    describe('create', () => {
        it('should create an PlayerRecord', async () => {
            const record: PlayerRecordType = {
                ...defaultPlayerRecord,
                playerId: 12,
                gameDayId: 132,
                points: 80,
            };
            const result = await playerRecordService.create(record);
            expect(result).toEqual(record);
        });

        it('should refuse to create an PlayerRecord with invalid data', async () => {
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                year: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                responses: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                played: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                won: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                drawn: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                lost: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                points: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                averages: -1.0,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                stalwart: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                pub: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rankPoints: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rankAverages: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rankStalwart: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rankSpeedy: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rankPub: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                speedy: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                gameDayId: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                playerId: -1,
            })).rejects.toThrow();
        });

        it('should refuse to create an PlayerRecord that has the same Player ID, year and GameDay ID as an existing one', async () => {
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                playerId: 12,
                year: 2021,
                gameDayId: 15,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a playerRecord where the combination of GameDay ID and Player ID did not exist', async () => {
            const result = await playerRecordService.upsert(defaultPlayerRecord);
            expect(result).toEqual(defaultPlayerRecord);
        });

        it('should update an existing PlayerRecord where the combination of Player ID, year and GameDay ID already existed', async () => {
            const updatedPlayerRecord = {
                ...defaultPlayerRecord,
                playerId: 12,
                year: 2021,
                gameDayId: 15,
                points: 23,
            };
            const result = await playerRecordService.upsert(updatedPlayerRecord);
            expect(result).toEqual(updatedPlayerRecord);
        });
    });

    describe('upsertForGameDay for known GameDay with no outcomes', () => {
        beforeEach(() => {
            (prisma.gameDay.findUnique as Mock).mockResolvedValue({
                id: 15,
                date: new Date('2021-01-03'),
                game: true,
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
            (prisma.gameDay.findUnique as Mock).mockResolvedValue({
                id: 15,
                date: new Date('2022-01-03'),
                game: true,
                mailSent: new Date('2022-01-01'),
                comment: 'I heart footy',
                bibs: 'A',
                pickerGamesHistory: 10,
            });

            (prisma.gameDay.findMany as Mock).mockResolvedValue(
                Array.from({ length: 15 }, (_, index) => ({
                    id: index + 1,
                    date: index < 11 ? new Date('2021-01-03') : new Date('2022-01-03'),
                    game: true,
                    mailSent: index < 11 ? new Date('2021-01-01') : new Date('2022-01-01'),
                    comment: 'I heart footy',
                    bibs: 'A',
                    pickerGamesHistory: 10,
                })),
            );

            (prisma.gameDay.count as Mock).mockResolvedValue(15);

            (prisma.outcome.findMany as Mock).mockResolvedValue(
                Array.from({ length: 150 }, (_, index) => ({
                    gameDayId: index / 10 + 1,
                    playerId: index % 10 + 1,
                    response: index < 141 ? 'Yes' : 'No',
                    responseInterval: index != 100 ? 3000 : null,
                    points: index < 141 ? index % 2 ? 3 : 0 : null,
                    team: index < 141 ? index % 2 ? 'A' : 'B' : null,
                    pub: index % 2 ? 1 : null,
                    paid: false,
                    goalie: false,
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
            expect(result).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    year: 2022,
                }),
                expect.objectContaining({
                    year: 0,
                }),
            ]));
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

    describe('upsertFromGameDay', () => {
        it('rebuilds player records by iterating game days from the changed game onward', async () => {
            const getAllSpy = vi.spyOn(gameDayService, 'getAll').mockResolvedValue([
                {
                    id: 2,
                    year: 2024,
                    date: new Date('2024-01-10T00:00:00Z'),
                    game: true,
                    mailSent: new Date('2024-01-08T09:00:00Z'),
                    comment: null,
                    bibs: 'A',
                    pickerGamesHistory: 10,
                    cost: 450,
                },
                {
                    id: 3,
                    year: 2024,
                    date: new Date('2024-01-17T00:00:00Z'),
                    game: true,
                    mailSent: new Date('2024-01-15T09:00:00Z'),
                    comment: null,
                    bibs: 'B',
                    pickerGamesHistory: 10,
                    cost: 450,
                },
            ]);
            const upsertForGameDaySpy = vi
                .spyOn(playerRecordService, 'upsertForGameDay')
                .mockImplementation((gameDayId?: number) => {
                    if (!gameDayId) return Promise.resolve([]);
                    return Promise.resolve([
                        createMockPlayerRecord({
                            id: gameDayId,
                            playerId: 1,
                            year: gameDayId === 2 ? 2024 : 0,
                            gameDayId,
                        }),
                    ]);
                });

            const result = await playerRecordService.upsertFromGameDay(2);

            expect(getAllSpy).toHaveBeenCalledWith({
                onOrAfter: 2,
            });
            expect(upsertForGameDaySpy).toHaveBeenCalledTimes(2);
            expect(upsertForGameDaySpy).toHaveBeenNthCalledWith(1, 2);
            expect(upsertForGameDaySpy).toHaveBeenNthCalledWith(2, 3);
            expect(result).toHaveLength(2);
            expect(prisma.playerRecord.deleteMany).not.toHaveBeenCalled();

            getAllSpy.mockRestore();
            upsertForGameDaySpy.mockRestore();
        });

        it('returns no records when no later game days exist', async () => {
            const getAllSpy = vi.spyOn(gameDayService, 'getAll').mockResolvedValueOnce([]);
            const upsertForGameDaySpy = vi.spyOn(playerRecordService, 'upsertForGameDay');

            const result = await playerRecordService.upsertFromGameDay(9999);

            expect(result).toEqual([]);
            expect(getAllSpy).toHaveBeenCalledWith({
                onOrAfter: 9999,
            });
            expect(upsertForGameDaySpy).not.toHaveBeenCalled();
            getAllSpy.mockRestore();
            upsertForGameDaySpy.mockRestore();
        });
    });

    describe('delete', () => {
        it('should delete an existing PlayerRecord', async () => {
            await playerRecordService.delete(12, 2021, 15);
            expect(prisma.playerRecord.delete).toHaveBeenCalledTimes(1);
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
            (prisma.playerRecord.delete as Mock).mockRejectedValueOnce(notFoundError);
            await playerRecordService.delete(16, 2022, 7);
            expect(prisma.playerRecord.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all PlayerRecords', async () => {
            await playerRecordService.deleteAll();
            expect(prisma.playerRecord.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

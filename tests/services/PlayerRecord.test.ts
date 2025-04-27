import fs from 'fs';
import prisma from 'lib/prisma';
import { PlayerRecord } from 'prisma/generated/prisma/client';
import { TableNameSchema } from 'prisma/generated/zod';
import playerRecordService from 'services/PlayerRecord';

jest.mock('lib/prisma', () => ({
    playerRecord: {
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
}));

const defaultPlayerRecord: PlayerRecord = {
    id: 1,
    year: 2021,
    responses: 10,
    played: 10,
    won: 5,
    drawn: 3,
    lost: 2,
    points: 18,
    averages: 1.8,
    stalwart: 5,
    pub: 1,
    rankPoints: 1,
    rankAverages: 2,
    rankAveragesUnqualified: 2,
    rankStalwart: 3,
    rankSpeedy: 4,
    rankSpeedyUnqualified: 4,
    rankPub: 5,
    speedy: 4,

    gameDayId: 15,
    playerId: 12,
};

const playerRecordList: PlayerRecord[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultPlayerRecord,
    gameDayId: 10 + index / 10 + 1,
}));

describe('PlayerRecordService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.playerRecord.findUnique as jest.Mock).mockImplementation((args: {
            where: {
                playerId_year_gameDayId: {
                    playerId: number,
                    year: number,
                    gameDayId: number,
                }
            }
        }) => {
            const playerRecord = playerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.where.playerId_year_gameDayId.playerId &&
                playerRecord.year === args.where.playerId_year_gameDayId.year &&
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId,
            );
            return Promise.resolve(playerRecord ? playerRecord : null);
        });

        (prisma.playerRecord.findMany as jest.Mock).mockImplementation((args: {
            where: {
                gameDayId: number,
                year: number,
                playerId: number,
            },
            take: number,
            orderBy: { responseInterval: 'desc' }
        }) => {
            return Promise.resolve(playerRecordList.filter((playerRecord) =>
                playerRecord.playerId === args.where.playerId &&
                playerRecord.year === args.where.year &&
                playerRecord.gameDayId < args.where.gameDayId).slice(0, args.take,
                ));
        });

        (prisma.playerRecord.create as jest.Mock).mockImplementation((args: { data: PlayerRecord }) => {
            const playerRecord = playerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.data.playerId &&
                playerRecord.year === args.data.year &&
                playerRecord.gameDayId === args.data.gameDayId,
            );

            if (playerRecord) {
                return Promise.reject(new Error('PlayerRecord already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.playerRecord.upsert as jest.Mock).mockImplementation((args: {
            where: {
                playerId_year_gameDayId: {
                    playerId: number,
                    year: number,
                    gameDayId: number,
                }
            },
            update: PlayerRecord,
            create: PlayerRecord,
        }) => {
            const playerRecord = playerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.where.playerId_year_gameDayId.playerId &&
                playerRecord.year === args.where.playerId_year_gameDayId.year &&
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId,
            );

            if (playerRecord) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.playerRecord.delete as jest.Mock).mockImplementation((args: {
            where: {
                playerId_year_gameDayId: {
                    playerId: number,
                    year: number,
                    gameDayId: number,
                }
            }
        }) => {
            const playerRecord = playerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.where.playerId_year_gameDayId.playerId &&
                playerRecord.year === args.where.playerId_year_gameDayId.year &&
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId,
            );
            return Promise.resolve(playerRecord ? playerRecord : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct PlayerRecord for Player 12, Year 2021 and GameDay 15', async () => {
            const result = await playerRecordService.get(12, 2021, 15);
            expect(result).toEqual({
                ...defaultPlayerRecord,
                gameDayId: 15,
                playerId: 12,
                points: expect.any(Number),
            } as PlayerRecord);
        });

        it('should return null for Player 16, Year 2022, GameDay 7', async () => {
            const result = await playerRecordService.get(16, 2022, 7);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.playerRecord.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(playerRecordList);
            });
        });

        it('should retrieve all PlayerRecords', async () => {
            const result = await playerRecordService.getAll();
            if (result) {
                expect(result.length).toEqual(100);
                for (const playerRecord of result) {
                    expect(playerRecord).toEqual({
                        ...defaultPlayerRecord,
                        gameDayId: expect.any(Number),
                    } as PlayerRecord);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('getProgress', () => {
        it('should retrieve the correct numbers for PlayerRecords and last GameDay', async () => {
            (prisma.outcome.findFirst as jest.Mock).mockResolvedValue({
                gameDayId: 15,
            });

            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                gameDayId: 10,
            });

            const result = await playerRecordService.getProgress();
            expect(result).toEqual([10, 15]);
            expect(prisma.outcome.findFirst).toHaveBeenCalledTimes(1);
            expect(prisma.playerRecord.findFirst).toHaveBeenCalledTimes(1);
        });

        it('should return null if there are no PlayerRecords', async () => {
            (prisma.outcome.findFirst as jest.Mock).mockResolvedValue({
                gameDayId: 15,
            });

            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await playerRecordService.getProgress();
            expect(result).toEqual([0, 15]);
        });

        it('should return null if there are no Outcomes', async () => {
            (prisma.outcome.findFirst as jest.Mock).mockResolvedValue(null);

            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await playerRecordService.getProgress();
            expect(result).toBeNull();
        });
    });

    describe('getAllYears', () => {
        it('should retrieve the correct years', async () => {
            (prisma.playerRecord.findMany as jest.Mock).mockResolvedValue([
                {
                    year: 0,
                },
                {
                    year: 2021,
                },
                {
                    year: 2022,
                },
            ]);

            const result = await playerRecordService.getAllYears();
            expect(result).toEqual([2021, 2022, 0]);
        });

        it('should retrieve the correct years even if the query returns them in a weird order', async () => {
            (prisma.playerRecord.findMany as jest.Mock).mockResolvedValue([
                {
                    year: 2021,
                },
                {
                    year: 0,
                },
                {
                    year: 2022,
                },
            ]);

            const result = await playerRecordService.getAllYears();
            expect(result).toEqual([2021, 2022, 0]);
        });
    });

    describe('getByGameDay', () => {
        beforeEach(() => {
            (prisma.playerRecord.findMany as jest.Mock).mockImplementation((args: { where: { gameDayId: number } }) => {
                return Promise.resolve(playerRecordList.filter((playerRecord) => playerRecord.gameDayId === args.where.gameDayId));
            });
        });

        it('should retrieve the correct PlayerRecords for GameDay id 15', async () => {
            const result = await playerRecordService.getByGameDay(15);
            if (result) {
                expect(result.length).toEqual(1);
                for (const playerRecordResult of result) {
                    expect(playerRecordResult).toEqual({
                        ...defaultPlayerRecord,
                        playerId: expect.any(Number),
                        gameDayId: 15,
                    } as PlayerRecord);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should retrieve the correct PlayerRecords for GameDay id 15 and year 2021', async () => {
            const result = await playerRecordService.getByGameDay(15, 2021);
            if (result) {
                expect(result.length).toEqual(1);
                for (const playerRecordResult of result) {
                    expect(playerRecordResult).toEqual({
                        ...defaultPlayerRecord,
                        playerId: expect.any(Number),
                        gameDayId: 15,
                    } as PlayerRecord);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return an empty list when retrieving playerRecords for GameDay id 101', async () => {
            const result = await playerRecordService.getByGameDay(101);
            expect(result).toEqual([]);
        });
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.playerRecord.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(playerRecordList.filter((playerRecord) => playerRecord.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct PlayerRecords for Player ID 12', async () => {
            const result = await playerRecordService.getByPlayer(12);
            if (result) {
                expect(result.length).toEqual(100);
                for (const playerRecordResult of result) {
                    expect(playerRecordResult).toEqual({
                        ...defaultPlayerRecord,
                        playerId: 12,
                        gameDayId: expect.any(Number),
                    } as PlayerRecord);
                }
            }
            else {
                throw new Error("Result is null");
            }
        });

        it('should return an empty list when retrieving PlayerRecords for Player id 11', async () => {
            const result = await playerRecordService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getForYearByPlayer', () => {
        it('should retrieve the correct PlayerRecord for Player ID 12 and Year 2021', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue(defaultPlayerRecord);
            const result = await playerRecordService.getForYearByPlayer(12, 2021);
            expect(result).toEqual(defaultPlayerRecord);
            expect(prisma.playerRecord.findFirst).toHaveBeenCalledTimes(1);
        });
    });

    describe('getWinners', () => {
        beforeEach(() => {
            (prisma.gameDay.groupBy as jest.Mock).mockResolvedValue([
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

            const playerRecordList: PlayerRecord[] = JSON.parse(fs.readFileSync('./tests/services/data/PlayerRecord.test.json').toString());

            (prisma.playerRecord.findMany as jest.Mock).mockImplementation(() => {
                const playerRecords = playerRecordList.filter((playerRecord) =>
                    playerRecord.rankPoints === 1 &&
                    playerRecord.year !== 0);
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve all the winners for the points table for all years', async () => {
            const result = await playerRecordService.getWinners(TableNameSchema.enum.points);
            expect(result.length).toEqual(2);
            expect(result[0].year).toEqual(2023);
            expect(result[1].playerId).toEqual(191);
        });

        it('should retrieve all the winners for the points table for a specific year', async () => {
            const result = await playerRecordService.getWinners(TableNameSchema.enum.points, 2023);
            expect(result.length).toEqual(2);
            expect(result[0].year).toEqual(2023);
            expect(result[1].playerId).toEqual(191);
        });

        it('should return an empty list when there are no season-ending games', async () => {
            (prisma.gameDay.groupBy as jest.Mock).mockResolvedValue([]);
            const result = await playerRecordService.getWinners(TableNameSchema.enum.points);
            expect(result).toEqual([]);
        });
    });

    describe('getTable', () => {
        beforeEach(() => {
            const playerRecordList: PlayerRecord[] = JSON.parse(fs.readFileSync('./tests/services/data/PlayerRecord.test.json').toString());

            (prisma.playerRecord.findMany as jest.Mock).mockImplementation((args: {
                where: {
                    gameDayId: number,
                    year: number,
                    rankPoints?: {
                        not: null,
                    },
                },
                take: number
            }) => {
                const playerRecords = playerRecordList.filter((playerRecord) =>
                    playerRecord.year === args.where.year &&
                    playerRecord.gameDayId == args.where.gameDayId &&
                    (!args.where.rankPoints || (playerRecord.rankPoints != null)));
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve the correct PlayerRecords for the points table for a given year', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2022);
            expect(result.length).toEqual(18);
        });

        it('should retrieve the same PlayerRecords for the points table when qualified is set explicitly for a given year', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2022, true);
            expect(result.length).toEqual(18);
        });

        it('should retrieve the correct PlayerRecords for the points table for all time', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1153,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 0);
            expect(result.length).toEqual(179);
        });

        it('should return an empty list when retrieving the points table for a year with no PlayerRecords', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({});
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 2010);
            expect(result.length).toEqual(0);
        });

        it('should return an empty list when retrieving the points table for a year that does not exist', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await playerRecordService.getTable(TableNameSchema.enum.points, 1984);
            expect(result.length).toEqual(0);
        });
    });

    describe('getTable qualified/unqualified averages', () => {
        beforeEach(() => {
            const playerRecordList: PlayerRecord[] = JSON.parse(fs.readFileSync('./tests/services/data/PlayerRecord.test.json').toString());

            (prisma.playerRecord.findMany as jest.Mock).mockImplementation((args: {
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
                const playerRecords = playerRecordList.filter((playerRecord) =>
                    playerRecord.year === args.where.year &&
                    playerRecord.gameDayId == args.where.gameDayId &&
                    (!args.where.rankAverages || (playerRecord.rankAverages != null)) &&
                    (!args.where.rankAveragesUnqualified || (playerRecord.rankAveragesUnqualified != null)));
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve the correct PlayerRecords for the qualified averages table for a given year', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.averages, 2022, true);
            expect(result.length).toEqual(0);
        });

        it('should retrieve the correct PlayerRecords for the unqualified averages table for a given year', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.averages, 2022, false);
            expect(result.length).toEqual(18);
        });
    });

    describe('getTable qualified/unqualified speedy', () => {
        beforeEach(() => {
            const playerRecordList: PlayerRecord[] = JSON.parse(fs.readFileSync('./tests/services/data/PlayerRecord.test.json').toString());

            (prisma.playerRecord.findMany as jest.Mock).mockImplementation((args: {
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
                const playerRecords = playerRecordList.filter((playerRecord) =>
                    playerRecord.year === args.where.year &&
                    playerRecord.gameDayId == args.where.gameDayId &&
                    (!args.where.rankSpeedy || (playerRecord.rankSpeedy != null)) &&
                    (!args.where.rankSpeedyUnqualified || (playerRecord.rankSpeedyUnqualified != null)));
                return Promise.resolve(playerRecords);
            });
        });

        it('should retrieve the correct PlayerRecords for the qualified speedy table for a given year', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.speedy, 2022, true);
            expect(result.length).toEqual(12);
        });

        it('should retrieve the correct PlayerRecords for the unqualified speedy table for a given year', async () => {
            (prisma.playerRecord.findFirst as jest.Mock).mockResolvedValue({
                "gameDayId": 1087,
            });
            const result = await playerRecordService.getTable(TableNameSchema.enum.speedy, 2022, false);
            expect(result.length).toEqual(10);
        });
    });

    describe('create', () => {
        it('should create an PlayerRecord', async () => {
            const record: PlayerRecord = {
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
            (prisma.gameDay.findUnique as jest.Mock).mockResolvedValue({
                id: 15,
                date: new Date('2021-01-03'),
                game: true,
                mailSent: new Date('2021-01-01'),
                comment: 'I heart footy',
                bibs: 'A',
                pickerGamesHistory: 10,
            });

            (prisma.gameDay.findMany as jest.Mock).mockResolvedValue([]);
        });

        it('should create not PlayerRecords for a GameDay with no outcomes', async () => {
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });
    });

    describe('upsertForGameDay for known GameDay with outcomes', () => {
        beforeEach(() => {
            (prisma.gameDay.findUnique as jest.Mock).mockResolvedValue({
                id: 15,
                date: new Date('2022-01-03'),
                game: true,
                mailSent: new Date('2022-01-01'),
                comment: 'I heart footy',
                bibs: 'A',
                pickerGamesHistory: 10,
            });

            (prisma.gameDay.findMany as jest.Mock).mockResolvedValue(
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

            (prisma.gameDay.count as jest.Mock).mockResolvedValue(15);

            (prisma.outcome.findMany as jest.Mock).mockResolvedValue(
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
            expect(result.length).toEqual(20);
        });

        it('should create or update all PlayerRecords for every GameDay', async () => {
            const result = await playerRecordService.upsertForGameDay();
            expect(result.length).toEqual(300);
        });

        it('should do nothing if no Outcomes exist for the given GameDay', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValue([]);
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
            (prisma.gameDay.findMany as jest.Mock).mockResolvedValue([]);
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });

        it('should do nothing if there are no outcomes', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValue([]);
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toEqual([]);
        });
    });

    describe('delete', () => {
        it('should delete an existing PlayerRecord', async () => {
            await playerRecordService.delete(12, 2021, 15);
        });

        it('should silently return when asked to delete an PlayerRecord that does not exist', async () => {
            await playerRecordService.delete(16, 2022, 7);
        });
    });

    describe('deleteAll', () => {
        it('should delete all PlayerRecords', async () => {
            await playerRecordService.deleteAll();
        });
    });
});

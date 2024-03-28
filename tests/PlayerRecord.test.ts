import { PlayerRecord } from '@prisma/client';
import playerRecordService from 'services/PlayerRecord';
import prisma from 'lib/prisma';
import { Prisma } from '@prisma/client';

jest.mock('lib/prisma', () => ({
    playerRecord: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
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
        count: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultPlayerRecord: PlayerRecord = {
    year: 2021,
    responses: 10,
    P: 10,
    W: 5,
    D: 3,
    L: 2,
    points: 18,
    averages: new Prisma.Decimal(1.8),
    stalwart: 5,
    pub: 3,
    rank_points: 1,
    rank_averages: 2,
    rank_stalwart: 3,
    rank_speedy: 4,
    rank_pub: 5,
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
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId
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
            orderBy: { responseTime: 'desc' }
        }) => {
            return Promise.resolve(playerRecordList.filter((playerRecord) =>
                playerRecord.playerId === args.where.playerId &&
                playerRecord.year === args.where.year &&
                playerRecord.gameDayId < args.where.gameDayId).slice(0, args.take
                ));
        });

        (prisma.playerRecord.create as jest.Mock).mockImplementation((args: { data: PlayerRecord }) => {
            const playerRecord = playerRecordList.find((playerRecord) =>
                playerRecord.playerId === args.data.playerId &&
                playerRecord.year === args.data.year &&
                playerRecord.gameDayId === args.data.gameDayId
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
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId
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
                playerRecord.gameDayId === args.where.playerId_year_gameDayId.gameDayId
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
                        gameDayId: expect.any(Number)
                    } as PlayerRecord);
                }
            }
            else {
                throw new Error("Result is null");
            }
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
                P: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                W: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                D: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                L: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                points: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                averages: new Prisma.Decimal(-1),
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
                rank_points: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rank_averages: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rank_stalwart: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rank_speedy: -1,
            })).rejects.toThrow();
            await expect(playerRecordService.create({
                ...defaultPlayerRecord,
                rank_pub: -1,
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

    describe('upsertForGameDay for unknown GameDay', () => {
        beforeEach(() => {
            (prisma.gameDay.findUnique as jest.Mock).mockResolvedValue(null);
        });

        it('should not create or modify any PlayerRecords for a non-existent GameDay', async () => {
            await expect(playerRecordService.upsertForGameDay(14)).rejects.toThrow();
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
                picker_games_history: 10,
            });
        });

        it('should create not PlayerRecords for a GameDay with no outcomes', async () => {
            const result = await playerRecordService.upsertForGameDay(15);
            expect(result).toBeNull();
        });
    });

    describe('upsertForGameDay for known GameDay with outcomes', () => {
        beforeEach(() => {
            (prisma.gameDay.findUnique as jest.Mock).mockResolvedValue({
                id: 15,
                date: new Date('2021-01-03'),
                game: true,
                mailSent: new Date('2021-01-01'),
                comment: 'I heart footy',
                bibs: 'A',
                picker_games_history: 10,
            });

            (prisma.outcome.findMany as jest.Mock).mockResolvedValue(
                Array.from({ length: 15 }, (_, index) => ({
                    gameDayId: 15,
                    playerId: index % 10 + 1,
                    response: index < 11 ? 'Yes' : 'No',
                    responseTime: new Date(),
                    points: index < 11 ? index % 2 ? 3 : 0 : null,
                    team: index < 11 ? index % 2 ? 'A' : 'B' : null,
                    pub: true,
                    paid: false,
                    goalie: false,
                }))
            );
        });

        it('should create or update all PlayerRecords for a given GameDay', async () => {
            const result = await playerRecordService.upsertForGameDay(15);
            if (result) {
                expect(result.length).toEqual(15);
            }
            else {
                throw new Error("Result is null");
            }
        });

        it.todo('should refuse to create or update any PlayerRecord with invalid data');
        it.todo('should do nothing if no Outcomes exist for the given GameDay');
        it.todo('should update the table ranks for all PlayerRecords with GameDays on or after the given GameDay');
        it.todo('should set values for both the year the game took place and for all time (year 0)');
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

import { GameDay } from '@prisma/client';
import gameDayService from 'services/GameDay';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    gameDay: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultGameDay: GameDay = {
    id: 1,
    date: new Date('2021-01-03'),
    game: true,
    mailSent: new Date('2021-01-01'),
    comment: 'I heart footy',
    bibs: 'A',
    picker_games_history: 10,
};

const gameDayList: GameDay[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultGameDay,
    id: index + 1,
}));

describe('GameDayService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.gameDay.findUnique as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameDay = gameDayList.find((gameDay) => gameDay.id === args.where.id);
            return Promise.resolve(gameDay ? gameDay : null);
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
        beforeEach(() => {
            (prisma.gameDay.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(gameDayList);
            });
        });

        it('should return the correct, complete list of 100 GameDays', async () => {
            const result = await gameDayService.getAll();
            if (result) {
                expect(result.length).toEqual(100);
                expect(result[11].id).toEqual(12);
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('getAllYears', () => {
        beforeEach(() => {
            (prisma.gameDay.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(gameDayList);
            });
        });

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
                picker_games_history: 7,
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

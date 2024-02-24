import { arse } from '@prisma/client';
import arseService from 'lib/arse';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    arse: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultArse: arse = {
    stamp: new Date(),
    playerId: 12,
    raterId: 12,
    in_goal: 10,
    running: 10,
    shooting: 10,
    passing: 10,
    ball_skill: 10,
    attacking: 10,
    defending: 10,
};

const arseList: arse[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultArse,
    playerId: (index + 1) % 10,
    raterId: index + 1,
}));

describe('ArseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // (prisma.arse.findUnique as jest.Mock).mockImplementation((args: { where: { id: number } }) => {
        //     if (args.where.id > 0 && args.where.id < 101) {
        //         return Promise.resolve(({
        //             ...defaultArse,
        //             id: args.where.id
        //         } as arse));
        //     }

        //     return Promise.resolve(null);
        // });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getByPlayer', () => {
        beforeEach(() => {
            (prisma.arse.findMany as jest.Mock).mockImplementation((args: { where: { playerId: number } }) => {
                return Promise.resolve(arseList.filter((arse) => arse.playerId === args.where.playerId));
            });
        });

        it('should retrieve the correct arses for player id 1', async () => {
            const result = await arseService.getByPlayer(1);
            expect(result.length).toEqual(10);
            for (const arseResult of result) {
                expect(arseResult).toEqual({
                    ...defaultArse,
                    playerId: 1,
                    raterId: expect.any(Number),
                    stamp: expect.any(Date)
                } as arse);
            }
        });

        it('should return an empty list when retrieving arses for player id 11', async () => {
            const result = await arseService.getByPlayer(11);
            expect(result).toEqual([]);
        });
    });

    describe('getByRater', () => {
        beforeEach(() => {
            (prisma.arse.findMany as jest.Mock).mockImplementation((args: { where: { raterId: number } }) => {
                return Promise.resolve(arseList.filter((arse) => arse.raterId === args.where.raterId));
            });
        });

        it('should retrieve the correct arses for rater id 1', async () => {
            const result = await arseService.getByRater(1);
            expect(result.length).toEqual(1);
            for (const arseResult of result) {
                expect(arseResult).toEqual({
                    ...defaultArse,
                    playerId: expect.any(Number),
                    raterId: 1,
                    stamp: expect.any(Date)
                } as arse);
            }
        });

        it('should return an empty list when retrieving arses for rater id 101', async () => {
            const result = await arseService.getByRater(101);
            expect(result).toEqual([]);
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.arse.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(arseList);
            });
        });

        it('should return the correct, complete list of 100 arses', async () => {
            const result = await arseService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].playerId).toEqual(2);
            expect(result[41].stamp).toEqual(expect.any(Date));
        });
    });

    describe('create', () => {
        it.todo('should create an arse');
        it.todo('should refuse to create an arse with invalid data');
    });

    describe('upsert', () => {
        it.todo('should create an arse where the id did not exist');
        it.todo('should update an existing arse where the id already existed');
        it.todo('should refuse to create an arse with invalid data where the id did not exist');
        it.todo('should refuse to update an arse with invalid data where the id already existed');
    });

    describe('delete', () => {
        it.todo('should delete an existing arse');
        it.todo('should silently return when asked to delete an arse that does not exist');
    });

    describe('deleteAll', () => {
        it.todo('should delete all arses');
        it.todo('should silently return if there are no arses to delete');
    });
});

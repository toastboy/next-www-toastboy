import { ServerArseService } from 'lib/arse';
import prisma from 'lib/prisma';
import { arse } from '@prisma/client';

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
    id: 1,
    stamp: new Date(),
    player: 12,
    rater: 12,
    in_goal: 10,
    running: 10,
    shooting: 10,
    passing: 10,
    ball_skill: 10,
    attacking: 10,
    defending: 10,
};

describe('ServerArseService', () => {
    let service: ServerArseService;

    beforeEach(() => {
        service = new ServerArseService();
        jest.clearAllMocks();

        (prisma.arse.findUnique as jest.Mock).mockImplementation((args: { where: { id: number } }) => {
            if (args.where.id > 0 && args.where.id < 101) {
                return Promise.resolve(<arse>{
                    ...defaultArse,
                    id: args.where.id
                });
            }

            return Promise.resolve(null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve an arse with id 1', async () => {
            const result = await service.get(1);
            expect(result).toEqual(<arse>{
                ...defaultArse,
                id: 1,
                stamp: expect.any(Date)
            });
        });

        it('should retrieve an arse with id 99', async () => {
            const result = await service.get(99);
            expect(result).toEqual(<arse>{
                ...defaultArse,
                id: 99,
                stamp: expect.any(Date)
            });
        });

        it('should return null when retrieving an arse with id 0', async () => {
            const result = await service.get(0);
            expect(result).toBeNull();
        });

        it('should return null when retrieving an arse with id 101', async () => {
            const result = await service.get(101);
            expect(result).toBeNull();
        });
    });

    // Similar structure for getAll, create, upsert, delete, deleteAll
});

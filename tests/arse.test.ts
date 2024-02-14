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

        (prisma.arse.findUnique as jest.Mock).mockResolvedValue(defaultArse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get method', () => {
        it('should retrieve an arse by id', async () => {
            const result = await service.get(1);
            expect(prisma.arse.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(<arse>{
                ...defaultArse,
                stamp: expect.any(Date)
            });
        });
    });

    // TODO: Similar structure for getAll, create, upsert, delete, deleteAll
});

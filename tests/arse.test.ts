import { ServerArseService, ClientArseService } from 'lib/arse';
import { arse } from '@prisma/client';
import prisma from 'lib/prisma';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

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
                return Promise.resolve(({
                    ...defaultArse,
                    id: args.where.id
                } as arse));
            }

            return Promise.resolve(null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve an arse with a valid id', async () => {
            const result = await service.get(1);
            expect(result).toEqual(({
                ...defaultArse,
                id: 1,
                stamp: expect.any(Date)
            } as arse));
        });

        it('should return null when retrieving an arse with an invalid id', async () => {
            const result = await service.get(-1);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it.todo('should return a list of arses');
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

describe('ClientArseService', () => {
    const service = new ClientArseService();
    const mock = new AxiosMockAdapter(axios);

    afterEach(() => {
        mock.reset();
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve an arse with a valid id', async () => {
            mock.onGet('/api/footy/arse/1').reply(200, { arse: defaultArse });
            const result = await service.get(1);
            expect(result).toEqual(({
                ...defaultArse,
                id: 1,
                stamp: expect.any(Date)
            } as arse));
        });

        it('should return null when retrieving an arse with an invalid id', async () => {
            mock.onGet('/api/footy/arse/-1').reply(404, null);
            const result = await service.get(-1);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it.todo('should return a list of arses');
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

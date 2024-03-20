import { Player } from '@prisma/client';
import playerService from 'services/Player';
import prisma from 'lib/prisma';

jest.mock('lib/prisma', () => ({
    player: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

const defaultPlayer: Player = {
    id: 1,
    is_admin: false,
    login: "gplayer",
    first_name: "Gary",
    last_name: "Player",
    email: "gary.player@example.com",
    joined: new Date("2021-01-01"),
    finished: null,
    born: new Date("1975-11-01"),
    introduced_by: 23,
    comment: null,
    anonymous: false,
    goalie: null
};

const invalidPlayer: Player = {
    ...defaultPlayer,
    id: -1,
};

const playerList: Player[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultPlayer,
    id: index + 1
}));

describe('PlayerService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const player = playerList.find((player) => player.id === args.where.id);
            return Promise.resolve(player ? player : null);
        });

        (prisma.player.create as jest.Mock).mockImplementation((args: { data: Player }) => {
            const player = playerList.find((player) => player.id === args.data.id);

            if (player) {
                return Promise.reject(new Error('player already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.player.upsert as jest.Mock).mockImplementation((args: {
            where: { id: number },
            update: Player,
            create: Player,
        }) => {
            const player = playerList.find((player) => player.id === args.where.id);

            if (player) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.player.delete as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const player = playerList.find((player) => player.id === args.where.id);
            return Promise.resolve(player ? player : null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getById', () => {
        it('should retrieve the correct player with id 6', async () => {
            const result = await playerService.getById(6);
            expect(result).toEqual({
                ...defaultPlayer,
                id: 6
            } as Player);
        });

        it('should return null for id 107', async () => {
            const result = await playerService.getById(107);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.player.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(playerList);
            });
        });

        it('should return the correct, complete list of 100 players', async () => {
            const result = await playerService.getAll();
            expect(result.length).toEqual(100);
            expect(result[11].id).toEqual(12);
        });
    });

    describe('create', () => {
        it('should create a player', async () => {
            const newPlayer: Player = {
                ...defaultPlayer,
                id: 106,
            };
            const result = await playerService.create(newPlayer);
            expect(result).toEqual(newPlayer);
        });

        it('should refuse to create a player with invalid data', async () => {
            await expect(playerService.create(invalidPlayer)).rejects.toThrow();
        });

        it('should refuse to create a player that has the same id as an existing one', async () => {
            await expect(playerService.create({
                ...defaultPlayer,
                id: 6,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a player', async () => {
            const result = await playerService.upsert(defaultPlayer);
            expect(result).toEqual(defaultPlayer);
        });

        it('should update an existing player where one with the id already existed', async () => {
            const updatedPlayer: Player = {
                ...defaultPlayer,
                id: 6,
            };
            const result = await playerService.upsert(updatedPlayer);
            expect(result).toEqual(updatedPlayer);
        });

        it('should refuse to create a player with invalid data where one with the id did not exist', async () => {
            await expect(playerService.create(invalidPlayer)).rejects.toThrow();
        });

        it('should refuse to update a player with invalid data where one with the id already existed', async () => {
            await expect(playerService.create(invalidPlayer)).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should delete an existing player', async () => {
            await playerService.delete(6);
        });

        it('should silently return when asked to delete a player that does not exist', async () => {
            await playerService.delete(107);
        });
    });

    describe('deleteAll', () => {
        it('should delete all players', async () => {
            await playerService.deleteAll();
        });
    });
});

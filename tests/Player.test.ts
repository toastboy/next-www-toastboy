import { Player, Outcome } from '@prisma/client';
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
    outcome: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
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

const defaultPlayer: Player = {
    id: 1,
    is_admin: false,
    login: "garyp",
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
    id: index + 1,
    finished: index % 2 === 0 ? new Date("2020-01-01") : null,
}));

const defaultOutcome: Outcome = {
    gameDayId: 1,
    playerId: 12,
    response: 'Yes',
    responseInterval: 2000,
    points: 3,
    team: 'A',
    comment: 'Test comment',
    pub: 1,
    paid: false,
    goalie: false,
};

describe('PlayerService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const player = playerList.find((player) => player.id === args.where.id);
            return Promise.resolve(player ? player : null);
        });

        (prisma.player.findMany as jest.Mock).mockImplementation((args: {
            where: { finished: boolean }
        }) => {
            if (args.where.finished === undefined) {
                return Promise.resolve(playerList);
            }

            return Promise.resolve(args.where.finished ?
                playerList.filter((player) => player.finished != null) :
                playerList.filter((player) => player.finished == null)
            );
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

    describe('getByLogin', () => {
        beforeEach(() => {
            (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
                where: { login: string }
            }) => {
                const player = playerList.find((player) => player.login === args.where.login);
                return Promise.resolve(player ? player : null);
            });
        });

        it('should retrieve the correct player with login ', async () => {
            const result = await playerService.getByLogin("garyp");
            expect(result).toEqual({
                ...defaultPlayer,
                finished: expect.any(Date),
                login: "garyp",
            } as Player);
        });

        it('should return null for login "doofus"', async () => {
            const result = await playerService.getByLogin("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getLogin with id', () => {
        beforeEach(() => {
            (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
                where: { id: number }
            }) => {
                const player = playerList.find((player) => player.id === args.where.id);
                return Promise.resolve(player ? player : null);
            });
        });

        it('should retrieve the correct player login with id 1', async () => {
            const result = await playerService.getLogin("1");
            expect(result).toEqual("garyp");
        });
        it('should return null for id 107', async () => {
            const result = await playerService.getLogin("107");
            expect(result).toBeNull();
        });
    });

    describe('getLogin with login', () => {
        beforeEach(() => {
            (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
                where: { login: string }
            }) => {
                const player = playerList.find((player) => player.login === args.where.login);
                return Promise.resolve(player ? player : null);
            });
        });

        it('should retrieve the correct player login with login "garyp"', async () => {
            const result = await playerService.getLogin("garyp");
            expect(result).toEqual("garyp");
        });

        it('should return null for login "doofus"', async () => {
            const result = await playerService.getLogin("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return the correct, complete list of 50 active players', async () => {
            const result = await playerService.getAll();
            expect(result.length).toEqual(50);
            expect(result[11].id).toEqual(24);
        });

        it('should return the correct, complete list of 50 players when active is false', async () => {
            const result = await playerService.getAll(false);
            expect(result.length).toEqual(50);
            expect(result[11].id).toEqual(23);
        });
    });

    describe('getAllIdsAndLogins', () => {
        beforeEach(() => {
            (prisma.player.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(playerList);
            });
        });

        it('should return the correct list of all ids and logins', async () => {
            const result = await playerService.getAllIdsAndLogins();
            expect(result.size).toEqual(101);
            expect(result.get("1")?.id).toEqual(1);
            expect(result.get("garyp")?.id).toEqual(100);
        });
    });

    describe('getName', () => {
        it('should return the correct name for a named player', async () => {
            const result = playerService.getName(defaultPlayer);
            expect(result).toEqual("Gary Player");
        });

        it('should return the correct name for an anonymous player', async () => {
            const result = playerService.getName({
                ...defaultPlayer,
                anonymous: true,
            });
            expect(result).toEqual("Player 1");
        });
    });

    describe('getForm', () => {
        it('should retrieve the correct player form for Player ID 1 and GameDay ID 5 or zero with history of 3', async () => {
            const outcomeListMock: Outcome[] = [
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 4,
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 3,
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 2,
                },
            ];

            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce(outcomeListMock);

            let result = await playerService.getForm(1, 5, 3);
            expect(result).toEqual(outcomeListMock);

            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce([]);

            result = await playerService.getForm(1, 0, 3);
            expect(result).toEqual([]);
        });

        it('should return an empty list when retrieving player form for Player ID 2 and GameDay ID 1 with history of 5', async () => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValueOnce([]);

            const result = await playerService.getForm(2, 1, 5);
            expect(result).toEqual([]);
        });

        it('should handle errors and throw an error', async () => {
            // Mock the prisma.outcome.findMany function to throw an error
            (prisma.outcome.findMany as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

            await expect(playerService.getForm(1, 5, 3)).rejects.toThrow('Test error');
        });
    });

    describe('getLastPlayed', () => {
        beforeEach(() => {
            (prisma.outcome.findFirst as jest.Mock).mockResolvedValue(
                {
                    gameDayId: 10,
                    playerId: 1,
                    response: 'Yes',
                    responseInterval: 2000,
                    points: 3,
                    team: 'A',
                    comment: 'Test comment',
                    pub: true,
                    paid: false,
                    goalie: false,
                    gameDay: {
                        id: 10,
                        date: new Date(),
                        game: 1,
                    },
                }
            );
        });

        it('should retrieve the correct last played GameDay for Player ID 1', async () => {
            const result = await playerService.getLastPlayed(1);
            if (result) {
                expect(result.gameDayId).toEqual(10);
            }
            else {
                throw new Error("Result is null");
            }
        });
    });

    describe('getYearsActive', () => {
        beforeEach(() => {
            (prisma.outcome.findMany as jest.Mock).mockResolvedValue(
                [
                    {
                        ...defaultOutcome,
                        gameDayId: 10,
                        gameDay: {
                            id: 10,
                            date: new Date('2021-01-01'),
                        },
                    },
                    {
                        ...defaultOutcome,
                        points: null,
                        gameDayId: 60,
                        gameDay: {
                            id: 60,
                            date: new Date('2022-01-01'),
                        },
                    },
                    {
                        ...defaultOutcome,
                        points: null,
                        pub: 2,
                        gameDayId: 110,
                        gameDay: {
                            id: 110,
                            date: new Date('2023-01-01'),
                        },
                    },
                ]
            );
        });
        it('should return 3 active years for player ID 1', async () => {
            const result = await playerService.getYearsActive(1);
            expect(prisma.outcome.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    playerId: 1
                },
                include: {
                    gameDay: true
                },
            });
            expect(result).toEqual([2021, 2022, 2023]);
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

import prisma from 'lib/prisma';
import { defaultPlayer } from 'mocks/data/player';
import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';
import playerService from 'services/Player';

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

const invalidPlayer: PlayerType = {
    ...defaultPlayer,
    id: -1,
};

const playerList: PlayerType[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultPlayer,
    id: index + 1,
    finished: index % 2 === 0 ? new Date("2020-01-01") : null,
}));

const defaultOutcome: OutcomeType = {
    id: 1,
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
            return Promise.resolve(player ?? null);
        });

        (prisma.player.findMany as jest.Mock).mockImplementation(() => {
            return Promise.resolve(playerList);
        });

        (prisma.player.create as jest.Mock).mockImplementation((args: { data: PlayerType }) => {
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
            update: PlayerType,
            create: PlayerType,
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
            return Promise.resolve(player ?? null);
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
                id: 6,
            } as PlayerType);
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
                return Promise.resolve(player ?? null);
            });
        });

        it('should retrieve the correct player with login', async () => {
            const result = await playerService.getByLogin("garyp");
            expect(result).toEqual({
                ...defaultPlayer,
                finished: expect.any(Date),
                login: "garyp",
            } as PlayerType);
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
                return Promise.resolve(player ?? null);
            });
        });

        it('should retrieve the correct player login with id 1', async () => {
            const result = await playerService.getLogin("1");
            expect(result).toBe("garyp");
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
                return Promise.resolve(player ?? null);
            });
        });

        it('should retrieve the correct player login with login "garyp"', async () => {
            const result = await playerService.getLogin("garyp");
            expect(result).toBe("garyp");
        });

        it('should return null for login "doofus"', async () => {
            const result = await playerService.getLogin("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getId with id', () => {
        beforeEach(() => {
            (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
                where: { id: number }
            }) => {
                const player = playerList.find((player) => player.id === args.where.id);
                return Promise.resolve(player ?? null);
            });
        });

        it('should retrieve the correct player login with id 1', async () => {
            const result = await playerService.getId("1");
            expect(result).toBe(1);
        });
        it('should return null for id 107', async () => {
            const result = await playerService.getId("107");
            expect(result).toBeNull();
        });
    });

    describe('getId with login', () => {
        beforeEach(() => {
            (prisma.player.findUnique as jest.Mock).mockImplementation((args: {
                where: { login: string }
            }) => {
                const player = playerList.find((player) => player.login === args.where.login);
                return Promise.resolve(player ?? null);
            });
        });

        it('should retrieve the correct player login with login "garyp"', async () => {
            const result = await playerService.getId("garyp");
            expect(result).toBe(1);
        });

        it('should return null for login "doofus"', async () => {
            const result = await playerService.getId("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getIdByEmail', () => {
        it('should return player id for exact email match', async () => {
            (prisma.player.findFirst as jest.Mock).mockResolvedValueOnce({
                ...defaultPlayer,
                id: 42,
                email: 'player@example.com',
            });

            const result = await playerService.getIdByEmail('player@example.com');
            expect(result).toBe(42);
            expect(prisma.player.findFirst).toHaveBeenCalledWith({
                where: {
                    email: {
                        equals: 'player@example.com',
                    },
                },
            });
        });

        it('should return null when no player found with email', async () => {
            (prisma.player.findFirst as jest.Mock).mockResolvedValueOnce(null);

            const result = await playerService.getIdByEmail('unknown@example.com');
            expect(result).toBeNull();
        });

        it('should use exact matching (not partial matching) for email lookup', async () => {
            (prisma.player.findFirst as jest.Mock).mockResolvedValueOnce(null);

            await playerService.getIdByEmail('test@example.com');

            // Verify that 'equals' is used instead of 'contains' for exact matching
            expect(prisma.player.findFirst).toHaveBeenCalledWith({
                where: {
                    email: {
                        equals: 'test@example.com',
                    },
                },
            });
        });
    });

    describe('getAll', () => {
        it('should return the correct, complete list of 100 players', async () => {
            const playerList: PlayerType[] = Array.from({ length: 100 }, (_, outerIndex) => ({
                ...defaultPlayer,
                id: outerIndex + 1,
                finished: outerIndex % 2 === 0 ? new Date("2020-01-01") : null,
                outcomes: Array.from({ length: 10 }, (_, index) => ({
                    ...defaultOutcome,
                    playerId: outerIndex + 1,
                    points: 3 * (index % 2),
                })),
            }));

            (prisma.player.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve(playerList);
            });

            const result = await playerService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].id).toBe(12);
        });

        it('should return null for firstResponded/lastResponded when player has no responses', async () => {
            const playerWithNoResponses: PlayerType & { outcomes: OutcomeType[] } = {
                ...defaultPlayer,
                id: 1,
                outcomes: [
                    {
                        ...defaultOutcome,
                        response: null,
                        points: null,
                    },
                ],
            };

            (prisma.player.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve([playerWithNoResponses]);
            });

            const result = await playerService.getAll();
            expect(result).toHaveLength(1);
            expect(result[0].firstResponded).toBeNull();
            expect(result[0].lastResponded).toBeNull();
            expect(result[0].firstPlayed).toBeNull();
            expect(result[0].lastPlayed).toBeNull();
        });

        it('should return null for firstPlayed/lastPlayed when player has responses but no games played', async () => {
            const playerWithResponsesButNoGames: PlayerType & { outcomes: OutcomeType[] } = {
                ...defaultPlayer,
                id: 1,
                outcomes: [
                    {
                        ...defaultOutcome,
                        gameDayId: 5,
                        response: 'Yes',
                        points: null,
                    },
                    {
                        ...defaultOutcome,
                        gameDayId: 10,
                        response: 'No',
                        points: null,
                    },
                ],
            };

            (prisma.player.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve([playerWithResponsesButNoGames]);
            });

            const result = await playerService.getAll();
            expect(result).toHaveLength(1);
            expect(result[0].firstResponded).toBe(5);
            expect(result[0].lastResponded).toBe(10);
            expect(result[0].firstPlayed).toBeNull();
            expect(result[0].lastPlayed).toBeNull();
        });

        it('should return correct values when player has empty outcomes array', async () => {
            const playerWithNoOutcomes: PlayerType & { outcomes: OutcomeType[] } = {
                ...defaultPlayer,
                id: 1,
                outcomes: [],
            };

            (prisma.player.findMany as jest.Mock).mockImplementation(() => {
                return Promise.resolve([playerWithNoOutcomes]);
            });

            const result = await playerService.getAll();
            expect(result).toHaveLength(1);
            expect(result[0].firstResponded).toBeNull();
            expect(result[0].lastResponded).toBeNull();
            expect(result[0].firstPlayed).toBeNull();
            expect(result[0].lastPlayed).toBeNull();
            expect(result[0].gamesPlayed).toBe(0);
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
            expect(result).toHaveLength(200);
            expect(result[0]).toBe("1");
            expect(result[1]).toBe("garyp");
        });
    });

    describe('getName', () => {
        it('should return the correct name for a named player', () => {
            const result = playerService.getName(defaultPlayer);
            expect(result).toBe("Gary Player");
        });

        it('should return the correct name for an anonymous player', () => {
            const result = playerService.getName({
                ...defaultPlayer,
                anonymous: true,
            });
            expect(result).toBe("Player 1");
        });
    });

    describe('getForm', () => {
        it('should retrieve the correct player form for Player ID 1 and GameDay ID 5 or zero with history of 3', async () => {
            const outcomeListMock: OutcomeType[] = [
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
                    pub: 1,
                    paid: false,
                    goalie: false,
                    gameDay: {
                        id: 10,
                        date: new Date(),
                        game: 1,
                    },
                },
            );
        });

        it('should retrieve the correct last played GameDay for Player ID 1', async () => {
            const result = await playerService.getLastPlayed(1);
            expect(result?.gameDayId).toBe(10);
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
                ],
            );
        });

        it('should return 3 active years for player ID 1', async () => {
            const result = await playerService.getYearsActive(1);
            expect(prisma.outcome.findMany).toHaveBeenCalledTimes(1);
            expect(prisma.outcome.findMany).toHaveBeenCalledWith({
                where: {
                    playerId: 1,
                },
                include: {
                    gameDay: true,
                },
            });
            expect(result).toEqual([2021, 2022, 2023, 0]);
        });
    });

    describe('create', () => {
        it('should create a player', async () => {
            const newPlayer: PlayerType = {
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
            const updatedPlayer: PlayerType = {
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
            expect(prisma.player.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a player that does not exist', async () => {
            await playerService.delete(107);
            expect(prisma.player.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all players', async () => {
            await playerService.deleteAll();
            expect(prisma.player.deleteMany).toHaveBeenCalledTimes(1);
        });
    });
});

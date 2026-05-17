import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import playerService from '@/services/Player';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { defaultOutcome } from '@/tests/mocks/data/outcome';
import {
    defaultPlayer,
    invalidPlayer,
} from '@/tests/mocks/data/player';
import { PlayerFormType } from '@/types';
import type { PlayerCreateWriteInput } from '@/types/PlayerStrictSchema';

describe('PlayerService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getById', () => {
        it('should retrieve the correct player with id 6', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce({ ...defaultPlayer, id: 6 });
            const result = await playerService.getById(6);
            expect(prisma.player.findUnique).toHaveBeenCalledWith({ where: { id: 6 } });
            expect(result).toEqual({ ...defaultPlayer, id: 6 });
        });

        it('should return null for id 107', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getById(107);
            expect(prisma.player.findUnique).toHaveBeenCalledWith({ where: { id: 107 } });
            expect(result).toBeNull();
        });

        it('should anonymise the returned name when player is anonymous', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce({
                ...defaultPlayer,
                id: 6,
                name: 'Hidden Name',
                anonymous: true,
            });

            const result = await playerService.getById(6);
            expect(result?.name).toBe('Player 6');
        });

        it('should return fallback name when player has no name', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce({
                ...defaultPlayer,
                id: 6,
                name: null,
                anonymous: false,
            });

            const result = await playerService.getById(6);
            expect(result?.name).toBe('Player 6');
        });
    });

    describe('getByLogin', () => {
        it('should retrieve the correct player with login', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce({
                playerId: 1,
                login: 'garyp',
                player: { ...defaultPlayer, id: 1, finished: new Date('2020-01-01') },
            });
            const result = await playerService.getByLogin("garyp");
            expect(prisma.playerLogin.findUnique).toHaveBeenCalledWith({
                where: { login: 'garyp' },
                include: { player: true },
            });
            expect(result?.id).toBe(1);
            expect(result?.finished).toBeInstanceOf(Date);
        });

        it('should return null for login "doofus"', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getByLogin("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getByIdOrLogin', () => {
        it('should retrieve a player by numeric id string', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce({ ...defaultPlayer, id: 6 });
            const result = await playerService.getByIdOrLogin('6');
            expect(result?.id).toBe(6);
        });

        it('should retrieve a player by login string', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce({
                playerId: 1,
                login: 'garyp',
                player: { ...defaultPlayer, id: 1, finished: new Date('2020-01-01') },
            });
            const result = await playerService.getByIdOrLogin('garyp');
            expect(result?.id).toBe(1);
        });

        it('should return null when the numeric id does not exist', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getByIdOrLogin('999');
            expect(result).toBeNull();
        });

        it('should return null when the login does not exist', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getByIdOrLogin('doofus');
            expect(result).toBeNull();
        });
    });

    describe('getLogin with id', () => {
        it('should retrieve the correct player login with id 1', async () => {
            (prisma.playerLogin.findFirst as Mock).mockResolvedValueOnce({ playerId: 1, login: 'garyp' });
            const result = await playerService.getLogin("1");
            expect(prisma.playerLogin.findFirst).toHaveBeenCalledWith({
                where: { playerId: 1 },
                orderBy: { login: 'asc' },
            });
            expect(result).toBe("garyp");
        });

        it('should return null for id 107', async () => {
            (prisma.playerLogin.findFirst as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getLogin("107");
            expect(result).toBeNull();
        });
    });

    describe('getLogin with login', () => {
        it('should retrieve the correct player login with login "garyp"', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce({ playerId: 1, login: 'garyp' });
            const result = await playerService.getLogin("garyp");
            expect(prisma.playerLogin.findUnique).toHaveBeenCalledWith({ where: { login: 'garyp' } });
            expect(result).toBe("garyp");
        });

        it('should return null for login "doofus"', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getLogin("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getId with id', () => {
        it('should retrieve the correct player login with id 1', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce({ ...defaultPlayer, id: 1 });
            const result = await playerService.getId("1");
            expect(prisma.player.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toBe(1);
        });

        it('should return null for id 107', async () => {
            (prisma.player.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getId("107");
            expect(result).toBeNull();
        });
    });

    describe('getId with login', () => {
        it('should retrieve the correct player login with login "garyp"', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce({ playerId: 1, login: 'garyp' });
            const result = await playerService.getId("garyp");
            expect(prisma.playerLogin.findUnique).toHaveBeenCalledWith({ where: { login: 'garyp' } });
            expect(result).toBe(1);
        });

        it('should return null for login "doofus"', async () => {
            (prisma.playerLogin.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await playerService.getId("doofus");
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all players', async () => {
            const fixture: (PlayerType & { outcomes: OutcomeType[]; extraEmails: PlayerExtraEmailType[] })[] = [
                {
                    ...defaultPlayer,
                    id: 1,
                    extraEmails: [],
                    outcomes: [{ ...defaultOutcome, playerId: 1, points: 3, response: 'Yes', gameDayId: 5 }],
                },
                {
                    ...defaultPlayer,
                    id: 2,
                    finished: new Date('2020-01-01'),
                    extraEmails: [],
                    outcomes: [],
                },
            ];
            (prisma.player.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await playerService.getAll();
            expect(prisma.player.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }));
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(2);
        });

        it('should return null for firstResponded/lastResponded when player has no responses', async () => {
            const playerWithNoResponses: PlayerType & { outcomes: OutcomeType[]; extraEmails: PlayerExtraEmailType[] } = {
                ...defaultPlayer,
                id: 1,
                extraEmails: [],
                outcomes: [
                    {
                        ...defaultOutcome,
                        response: null,
                        points: null,
                    },
                ],
            };

            (prisma.player.findMany as Mock).mockResolvedValueOnce([playerWithNoResponses]);

            const result = await playerService.getAll();
            expect(result).toHaveLength(1);
            expect(result[0].firstResponded).toBeNull();
            expect(result[0].lastResponded).toBeNull();
            expect(result[0].firstPlayed).toBeNull();
            expect(result[0].lastPlayed).toBeNull();
        });

        it('should return null for firstPlayed/lastPlayed when player has responses but no games played', async () => {
            const playerWithResponsesButNoGames: PlayerType & { outcomes: OutcomeType[]; extraEmails: PlayerExtraEmailType[] } = {
                ...defaultPlayer,
                id: 1,
                extraEmails: [],
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

            (prisma.player.findMany as Mock).mockResolvedValueOnce([playerWithResponsesButNoGames]);

            const result = await playerService.getAll();
            expect(result).toHaveLength(1);
            expect(result[0].firstResponded).toBe(5);
            expect(result[0].lastResponded).toBe(10);
            expect(result[0].firstPlayed).toBeNull();
            expect(result[0].lastPlayed).toBeNull();
        });

        it('should return correct values when player has empty outcomes array', async () => {
            const playerWithNoOutcomes: PlayerType & { outcomes: OutcomeType[]; extraEmails: PlayerExtraEmailType[] } = {
                ...defaultPlayer,
                id: 1,
                extraEmails: [],
                outcomes: [],
            };

            (prisma.player.findMany as Mock).mockResolvedValueOnce([playerWithNoOutcomes]);

            const result = await playerService.getAll();
            expect(result).toHaveLength(1);
            expect(result[0].firstResponded).toBeNull();
            expect(result[0].lastResponded).toBeNull();
            expect(result[0].firstPlayed).toBeNull();
            expect(result[0].lastPlayed).toBeNull();
            expect(result[0].gamesPlayed).toBe(0);
        });

        it('should anonymise names in list responses when players are anonymous', async () => {
            const anonymousPlayer: PlayerType & { outcomes: OutcomeType[]; extraEmails: PlayerExtraEmailType[] } = {
                ...defaultPlayer,
                id: 1,
                name: 'Should Not Leak',
                anonymous: true,
                extraEmails: [],
                outcomes: [],
            };

            (prisma.player.findMany as Mock).mockResolvedValueOnce([anonymousPlayer]);

            const result = await playerService.getAll();
            expect(result[0].name).toBe('Player 1');
        });

        it('should pass a finished:null filter when activeOnly is true', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([]);
            await playerService.getAll({ activeOnly: true });
            expect(prisma.player.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { finished: null } }),
            );
        });
    });

    describe('getAllIdsAndLogins', () => {
        it('should return the correct list of all ids and logins', async () => {
            const fixture = [
                { id: 1, logins: [{ login: 'garyp' }] },
                { id: 2, logins: [{ login: 'player2' }] },
            ];
            (prisma.player.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await playerService.getAllIdsAndLogins();
            expect(prisma.player.findMany).toHaveBeenCalledWith({
                select: {
                    id: true,
                    logins: {
                        select: { login: true },
                        orderBy: { login: 'asc' },
                    },
                },
            });
            expect(result).toHaveLength(4);
            expect(result[0]).toBe("1");
            expect(result[1]).toBe("garyp");
            expect(result[2]).toBe("2");
            expect(result[3]).toBe("player2");
        });
    });

    describe('getForm', () => {
        it('should retrieve the correct player form for Player ID 1 and GameDay ID 5 or zero with history of 3', async () => {
            const outcomeListMock: PlayerFormType[] = [
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 4,
                    gameDay: createMockGameDay({ id: 4 }),
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 3,
                    gameDay: createMockGameDay({ id: 3 }),
                },
                {
                    ...defaultOutcome,
                    playerId: 1,
                    gameDayId: 2,
                    gameDay: createMockGameDay({ id: 2 }),
                },
            ];

            (prisma.outcome.findMany as Mock).mockResolvedValueOnce(outcomeListMock);

            let result = await playerService.getForm(1, 5, 3);
            expect(result).toEqual(outcomeListMock);

            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);

            result = await playerService.getForm(1, 0, 3);
            expect(result).toEqual([]);
        });

        it('should return an empty list when retrieving player form for Player ID 2 and GameDay ID 1 with history of 5', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);

            const result = await playerService.getForm(2, 1, 5);
            expect(result).toEqual([]);
        });

        it('should handle errors and throw an error', async () => {
            // Mock the prisma.outcome.findMany function to throw an error
            (prisma.outcome.findMany as Mock).mockRejectedValueOnce(new Error('Test error'));

            await expect(playerService.getForm(1, 5, 3)).rejects.toThrow('Test error');
        });
    });

    describe('getLastPlayed', () => {
        it('should retrieve the correct last played GameDay for Player ID 1', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValueOnce({
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
            });
            const result = await playerService.getLastPlayed(1);
            expect(result?.gameDayId).toBe(10);
        });

        it('should pass year bounds when a year is provided', async () => {
            (prisma.outcome.findFirst as Mock).mockResolvedValueOnce(null);
            await playerService.getLastPlayed(1, 2022);
            expect(prisma.outcome.findFirst).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        playerId: 1,
                        points: { not: null },
                        gameDay: {
                            date: {
                                gte: new Date(2022, 0, 1),
                                lt: new Date(2023, 0, 1),
                            },
                        },
                    },
                }),
            );
        });
    });

    describe('getYearsActive', () => {
        it('should return 3 active years for player ID 1', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
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
            ]);
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

        it('should return an empty array when the player has no outcomes', async () => {
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);
            const result = await playerService.getYearsActive(1);
            expect(result).toEqual([]);
        });
    });

    describe('create', () => {
        it('should create a player', async () => {
            const newPlayer: PlayerCreateWriteInput = {
                name: defaultPlayer.name,
                joined: defaultPlayer.joined,
                finished: defaultPlayer.finished,
                born: defaultPlayer.born,
                introducedBy: defaultPlayer.introducedBy,
                comment: defaultPlayer.comment,
                anonymous: defaultPlayer.anonymous,
            };
            (prisma.player.create as Mock).mockResolvedValueOnce({ ...defaultPlayer, ...newPlayer, id: 1 });
            const result = await playerService.create(newPlayer);
            expect(prisma.player.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ ...defaultPlayer, ...newPlayer, id: 1 });
        });

        it('should refuse to create a player with invalid data', async () => {
            await expect(playerService.create({
                ...defaultPlayer,
                accountEmail: 'not-an-email',
            })).rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should update an existing player where one with the id already existed', async () => {
            const updatedPlayer: PlayerType = {
                ...defaultPlayer,
                id: 6,
            };
            (prisma.player.update as Mock).mockResolvedValueOnce(updatedPlayer);
            const result = await playerService.update(updatedPlayer);
            expect(result).toEqual(updatedPlayer);
        });

        it('should refuse to create a player with invalid data where one with the id did not exist', async () => {
            await expect(playerService.update(invalidPlayer)).rejects.toThrow();
        });

        it('should refuse to update a player with invalid data where one with the id already existed', async () => {
            await expect(playerService.update(invalidPlayer)).rejects.toThrow();
        });
    });

    describe('anonymise', () => {
        it('should set anonymous=true and clear name and accountEmail', async () => {
            (prisma.player.update as Mock).mockResolvedValueOnce({
                ...defaultPlayer,
                id: 6,
                anonymous: true,
                name: null,
                accountEmail: null,
                finished: new Date(),
            });
            const result = await playerService.anonymise(6);
            expect(prisma.player.update).toHaveBeenCalledWith({
                where: { id: 6 },
                data: {
                    anonymous: true,
                    name: null,
                    accountEmail: null,
                    finished: expect.any(Date) as unknown,
                },
            });
            expect(result.name).toBe('Player 6');
            expect(result.anonymous).toBe(true);
        });
    });

    describe('setFinished', () => {
        it('should set the finished field to now when finished=true', async () => {
            const now = new Date('2025-01-15T12:00:00Z');
            vi.useFakeTimers();
            vi.setSystemTime(now);
            (prisma.player.update as Mock).mockResolvedValueOnce({ ...defaultPlayer, id: 6, finished: now });

            try {
                const result = await playerService.setFinished(6);
                expect(prisma.player.update).toHaveBeenCalledWith({
                    where: { id: 6 },
                    data: { finished: now },
                });
                expect(result.finished).toEqual(now);
            } finally {
                vi.useRealTimers();
            }
        });

        it('should clear the finished field when finished=false', async () => {
            (prisma.player.update as Mock).mockResolvedValueOnce({ ...defaultPlayer, id: 6, finished: null });
            const result = await playerService.setFinished(6, false);
            expect(prisma.player.update).toHaveBeenCalledWith({
                where: { id: 6 },
                data: { finished: null },
            });
            expect(result.finished).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete an existing player', async () => {
            (prisma.player.delete as Mock).mockResolvedValueOnce({ ...defaultPlayer, id: 6 });
            await playerService.delete(6);
            expect(prisma.player.delete).toHaveBeenCalledWith({ where: { id: 6 } });
        });

        it('should silently return when asked to delete a player that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.player.delete as Mock).mockRejectedValueOnce(notFoundError);
            await playerService.delete(107);
            expect(prisma.player.delete).toHaveBeenCalledWith({ where: { id: 107 } });
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.player.delete as Mock).mockRejectedValueOnce(new Error('db exploded'));
            await expect(playerService.delete(6)).rejects.toThrow('db exploded');
        });
    });

    describe('deleteAll', () => {
        it('should delete all players', async () => {
            (prisma.player.deleteMany as Mock).mockResolvedValueOnce({ count: 0 });
            await playerService.deleteAll();
            expect(prisma.player.deleteMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('getFamilyTree', () => {
        it('should return a tree with the founder as root', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Alice', anonymous: false, introducedBy: null },
                { id: 2, name: 'Bob', anonymous: false, introducedBy: 1 },
                { id: 3, name: 'Charlie', anonymous: false, introducedBy: 1 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
            ]);

            const tree = await playerService.getFamilyTree();

            expect(tree.id).toBe(1);
            expect(tree.name).toBe('Alice');
            expect(tree.children).toHaveLength(2);
            expect(tree.children.map((c) => c.name).sort()).toEqual(['Bob', 'Charlie']);
        });

        it('should nest players whose introducer is also introduced', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Alice', anonymous: false, introducedBy: null },
                { id: 2, name: 'Bob', anonymous: false, introducedBy: 1 },
                { id: 3, name: 'Charlie', anonymous: false, introducedBy: 2 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
            ]);

            const tree = await playerService.getFamilyTree();

            expect(tree.name).toBe('Alice');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0].name).toBe('Bob');
            expect(tree.children[0].children).toHaveLength(1);
            expect(tree.children[0].children[0].name).toBe('Charlie');
        });

        it('should attach orphan introducers under the founder', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 2, name: 'Bob', anonymous: false, introducedBy: 1 },
                { id: 3, name: 'Charlie', anonymous: false, introducedBy: 999 },
                { id: 4, name: 'Dave', anonymous: false, introducedBy: 2 },
                { id: 5, name: 'Eve', anonymous: false, introducedBy: 3 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
                { playerId: 5 },
            ]);

            const tree = await playerService.getFamilyTree();

            /* Bob becomes the founder (first orphan who is an introducer).
               Charlie (also an orphan introducer) is attached under Bob. */
            expect(tree.name).toBe('Bob');
            expect(tree.children).toHaveLength(2);
            expect(tree.children.map((c) => c.name).sort()).toEqual(['Charlie', 'Dave']);
        });

        it('should exclude orphan players with null introducedBy who introduced nobody', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Alice', anonymous: false, introducedBy: null },
                { id: 2, name: 'Bob', anonymous: false, introducedBy: null },
                { id: 3, name: 'Recruit', anonymous: false, introducedBy: 1 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
            ]);

            const tree = await playerService.getFamilyTree();

            /* Alice is the founder (introduced Recruit). Bob is excluded
               (null introducedBy and introduced nobody). */
            expect(tree.name).toBe('Alice');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0].name).toBe('Recruit');
        });

        it('should include players with null introducedBy who introduced someone', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 10, name: 'Founder', anonymous: false, introducedBy: null },
                { id: 20, name: 'Orphan', anonymous: false, introducedBy: null },
                { id: 30, name: 'Child', anonymous: false, introducedBy: 10 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 10 },
                { playerId: 20 },
                { playerId: 30 },
            ]);

            const tree = await playerService.getFamilyTree();

            /* Founder is the root (introduced Child). Orphan is excluded. */
            expect(tree.name).toBe('Founder');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0].name).toBe('Child');
        });

        it('should exclude players who have never played a game', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Alice', anonymous: false, introducedBy: null },
                { id: 2, name: 'Bob', anonymous: false, introducedBy: 1 },
                { id: 3, name: 'Charlie', anonymous: false, introducedBy: 1 },
            ]);
            /* Only Alice and Bob have played; Charlie has not. */
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 2 },
            ]);

            const tree = await playerService.getFamilyTree();

            expect(tree.name).toBe('Alice');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0].name).toBe('Bob');
        });

        it('should re-parent children when their introducer has not played', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Alice', anonymous: false, introducedBy: null },
                { id: 2, name: 'Bob', anonymous: false, introducedBy: 1 },
                { id: 3, name: 'Charlie', anonymous: false, introducedBy: 2 },
            ]);
            /* Bob (the middle link) has never played. */
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 3 },
            ]);

            const tree = await playerService.getFamilyTree();

            /* Charlie should be re-parented to Alice (Bob's introducer). */
            expect(tree.name).toBe('Alice');
            expect(tree.children).toHaveLength(1);
            expect(tree.children[0].name).toBe('Charlie');
        });

        it('should respect anonymous flag in display names', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Secret', anonymous: true, introducedBy: 5 },
                { id: 2, name: 'Child', anonymous: false, introducedBy: 1 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 2 },
            ]);

            const tree = await playerService.getFamilyTree();

            expect(tree.name).toBe('Player 1');
            expect(tree.children[0].name).toBe('Child');
        });

        it('should return virtual root with empty children when no players exist', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([]);

            const tree = await playerService.getFamilyTree();

            expect(tree.id).toBe(0);
            expect(tree.name).toBe('Toastboy FC');
            expect(tree.children).toHaveLength(0);
        });

        it('should return virtual root when players form a circular introducer reference', async () => {
            (prisma.player.findMany as Mock).mockResolvedValueOnce([
                { id: 1, name: 'Alice', anonymous: false, introducedBy: 2 },
                { id: 2, name: 'Bob', anonymous: false, introducedBy: 1 },
            ]);
            (prisma.outcome.findMany as Mock).mockResolvedValueOnce([
                { playerId: 1 },
                { playerId: 2 },
            ]);

            const tree = await playerService.getFamilyTree();

            expect(tree.id).toBe(0);
            expect(tree.name).toBe('Toastboy FC');
            expect(tree.children).toHaveLength(0);
        });
    });
});

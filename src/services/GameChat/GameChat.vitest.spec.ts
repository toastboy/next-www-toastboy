import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import { GameChatType } from 'prisma/zod/schemas/models/GameChat.schema';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import gameChatService from '@/services/GameChat';
import { defaultGameChat, defaultGameChatList } from '@/tests/mocks/data/gameChat';
import type { GameChatUpsertInput, GameChatWriteInput } from '@/types/GameChatStrictSchema';

describe('GameChatService', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (prisma.gameChat.findUnique as Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.where.id);
            return Promise.resolve(gameChat ?? null);
        });

        (prisma.gameChat.create as Mock).mockImplementation((args: { data: GameChatWriteInput }) => {
            return Promise.resolve({
                id: defaultGameChatList.length + 1,
                ...args.data,
            });
        });

        (prisma.gameChat.upsert as Mock).mockImplementation((args: {
            where: { id: number },
            update: Omit<GameChatType, 'id'>,
            create: Omit<GameChatType, 'id'>,
        }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.where.id);

            if (gameChat) {
                return Promise.resolve({
                    ...args.update,
                    id: args.where.id,
                });
            }
            else {
                return Promise.resolve({
                    ...args.create,
                    id: defaultGameChatList.length + 1,
                });
            }
        });

        (prisma.gameChat.delete as Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.where.id);
            return Promise.resolve(gameChat ?? null);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct GameChat with id 6', async () => {
            const result = await gameChatService.get(6);
            expect(result).toEqual({
                ...defaultGameChat,
                id: 6,
                gameDay: 6,
                player: 6,
            } as GameChatType);
        });

        it('should return null for id 107', async () => {
            const result = await gameChatService.get(107);
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            (prisma.gameChat.findMany as Mock).mockImplementation(() => {
                return Promise.resolve(defaultGameChatList);
            });
        });

        it('should return the correct, complete list of 100 GameChat', async () => {
            const result = await gameChatService.getAll();
            expect(result).toHaveLength(100);
            expect(result[11].id).toBe(12);
        });
    });

    describe('create', () => {
        it('should create a GameChat', async () => {
            const newGameChat: GameChatWriteInput = {
                gameDay: defaultGameChat.gameDay,
                stamp: defaultGameChat.stamp,
                player: defaultGameChat.player,
                body: defaultGameChat.body,
            };
            const result = await gameChatService.create(newGameChat);
            expect(result).toEqual({
                ...newGameChat,
                id: 101,
            });
        });

        it('should refuse to create a GameChat with invalid data', async () => {
            await expect(gameChatService.create({
                ...defaultGameChat,
                gameDay: -1,
            })).rejects.toThrow();
            await expect(gameChatService.create({
                ...defaultGameChat,
                player: -1,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a GameChat with a database-generated id when where.id is missing', async () => {
            const input: GameChatUpsertInput = {
                id: 1001,
                gameDay: defaultGameChat.gameDay,
                stamp: defaultGameChat.stamp,
                player: defaultGameChat.player,
                body: defaultGameChat.body,
            };
            const result = await gameChatService.upsert(input);
            expect(result).toEqual({
                ...input,
                id: 101,
            });
        });

        it('should update an existing GameChat where one with the id already existed', async () => {
            const updatedGameChat: GameChatUpsertInput = {
                id: 6,
                gameDay: defaultGameChat.gameDay,
                stamp: defaultGameChat.stamp,
                player: defaultGameChat.player,
                body: defaultGameChat.body,
            };
            const result = await gameChatService.upsert(updatedGameChat);
            expect(result).toEqual(updatedGameChat);
        });
    });

    describe('delete', () => {
        it('should delete an existing GameChat', async () => {
            await gameChatService.delete(6);
            expect(prisma.gameChat.delete).toHaveBeenCalledTimes(1);
        });

        it('should silently return when asked to delete a GameChat that does not exist', async () => {
            const notFoundError = Object.assign(
                new Error('Record to delete does not exist.'),
                { code: 'P2025' },
            );
            Object.setPrototypeOf(
                notFoundError,
                Prisma.PrismaClientKnownRequestError.prototype,
            );
            (prisma.gameChat.delete as Mock).mockRejectedValueOnce(notFoundError);
            await gameChatService.delete(107);
            expect(prisma.gameChat.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteAll', () => {
        it('should delete all GameChats', async () => {
            await gameChatService.deleteAll();
            expect(prisma.gameChat.deleteMany).toHaveBeenCalled();
        });
    });
});

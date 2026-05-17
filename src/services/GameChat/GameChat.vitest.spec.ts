import { Prisma } from 'prisma/generated/client';
import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import gameChatService from '@/services/GameChat';
import { defaultGameChat } from '@/tests/mocks/data/gameChat';
import type { GameChatUpsertInput, GameChatWriteInput } from '@/types/GameChatStrictSchema';

describe('GameChatService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should retrieve the correct GameChat with id 6', async () => {
            (prisma.gameChat.findUnique as Mock).mockResolvedValueOnce({
                ...defaultGameChat,
                id: 6,
                gameDay: 6,
                player: 6,
            });
            const result = await gameChatService.get(6);
            expect(prisma.gameChat.findUnique).toHaveBeenCalledWith({ where: { id: 6 } });
            expect(result).toEqual({
                ...defaultGameChat,
                id: 6,
                gameDay: 6,
                player: 6,
            });
        });

        it('should return null for id 107', async () => {
            (prisma.gameChat.findUnique as Mock).mockResolvedValueOnce(null);
            const result = await gameChatService.get(107);
            expect(prisma.gameChat.findUnique).toHaveBeenCalledWith({ where: { id: 107 } });
            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('should return all GameChats', async () => {
            const fixture = [defaultGameChat, { ...defaultGameChat, id: 2, gameDay: 2, player: 2 }];
            (prisma.gameChat.findMany as Mock).mockResolvedValueOnce(fixture);
            const result = await gameChatService.getAll();
            expect(prisma.gameChat.findMany).toHaveBeenCalledWith({});
            expect(result).toEqual(fixture);
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
            (prisma.gameChat.create as Mock).mockResolvedValueOnce({ ...newGameChat, id: 1 });
            const result = await gameChatService.create(newGameChat);
            expect(prisma.gameChat.create).toHaveBeenCalledWith({
                data: {
                    gameDay: newGameChat.gameDay,
                    stamp: newGameChat.stamp,
                    player: newGameChat.player,
                    body: newGameChat.body,
                },
            });
            expect(result).toEqual({ ...newGameChat, id: 1 });
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
            const writeData = {
                gameDay: defaultGameChat.gameDay,
                stamp: defaultGameChat.stamp,
                player: defaultGameChat.player,
                body: defaultGameChat.body,
            };
            const input: GameChatUpsertInput = { id: 1001, ...writeData };
            (prisma.gameChat.upsert as Mock).mockResolvedValueOnce({ ...writeData, id: 1 });
            const result = await gameChatService.upsert(input);
            expect(prisma.gameChat.upsert).toHaveBeenCalledWith({
                where: { id: 1001 },
                create: writeData,
                update: writeData,
            });
            expect(result).toEqual({ ...writeData, id: 1 });
        });

        it('should update an existing GameChat where one with the id already existed', async () => {
            const writeData = {
                gameDay: defaultGameChat.gameDay,
                stamp: defaultGameChat.stamp,
                player: defaultGameChat.player,
                body: defaultGameChat.body,
            };
            const updatedGameChat: GameChatUpsertInput = { id: 6, ...writeData };
            (prisma.gameChat.upsert as Mock).mockResolvedValueOnce({ ...writeData, id: 6 });
            const result = await gameChatService.upsert(updatedGameChat);
            expect(prisma.gameChat.upsert).toHaveBeenCalledWith({
                where: { id: 6 },
                create: writeData,
                update: writeData,
            });
            expect(result).toEqual({ ...writeData, id: 6 });
        });
    });

    describe('delete', () => {
        it('should delete an existing GameChat', async () => {
            (prisma.gameChat.delete as Mock).mockResolvedValueOnce({ ...defaultGameChat, id: 6 });
            await gameChatService.delete(6);
            expect(prisma.gameChat.delete).toHaveBeenCalledWith({ where: { id: 6 } });
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
            expect(prisma.gameChat.delete).toHaveBeenCalledWith({ where: { id: 107 } });
        });

        it('should rethrow delete errors that are not P2025', async () => {
            (prisma.gameChat.delete as Mock).mockRejectedValueOnce(new Error('db exploded'));
            await expect(gameChatService.delete(6)).rejects.toThrow('db exploded');
        });
    });

    describe('deleteAll', () => {
        it('should delete all GameChats', async () => {
            (prisma.gameChat.deleteMany as Mock).mockResolvedValueOnce({ count: 0 });
            await gameChatService.deleteAll();
            expect(prisma.gameChat.deleteMany).toHaveBeenCalled();
        });
    });
});

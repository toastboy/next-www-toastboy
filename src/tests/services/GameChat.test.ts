import prisma from 'prisma/prisma';
import { GameChatType } from 'prisma/zod/schemas/models/GameChat.schema';

import gameChatService from '@/services/GameChat';
import { defaultGameChat, defaultGameChatList } from '@/tests/mocks';

jest.mock('prisma/prisma', () => ({
    gameChat: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
    },
}));

describe('GameChatService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.gameChat.findUnique as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.where.id);
            return Promise.resolve(gameChat ?? null);
        });

        (prisma.gameChat.create as jest.Mock).mockImplementation((args: { data: GameChatType }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.data.id);

            if (gameChat) {
                return Promise.reject(new Error('gameChat already exists'));
            }
            else {
                return Promise.resolve(args.data);
            }
        });

        (prisma.gameChat.upsert as jest.Mock).mockImplementation((args: {
            where: { id: number },
            update: GameChatType,
            create: GameChatType,
        }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.where.id);

            if (gameChat) {
                return Promise.resolve(args.update);
            }
            else {
                return Promise.resolve(args.create);
            }
        });

        (prisma.gameChat.delete as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameChat = defaultGameChatList.find((gameChat) => gameChat.id === args.where.id);
            return Promise.resolve(gameChat ?? null);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
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
            (prisma.gameChat.findMany as jest.Mock).mockImplementation(() => {
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
            const newGameChat: GameChatType = {
                ...defaultGameChat,
                id: 106,
            };
            const result = await gameChatService.create(newGameChat);
            expect(result).toEqual(newGameChat);
        });

        it('should refuse to create a GameChat with invalid data', async () => {
            await expect(gameChatService.create({
                ...defaultGameChat,
                id: -1,
            })).rejects.toThrow();
            await expect(gameChatService.create({
                ...defaultGameChat,
                gameDay: -1,
            })).rejects.toThrow();
            await expect(gameChatService.create({
                ...defaultGameChat,
                player: -1,
            })).rejects.toThrow();
        });

        it('should refuse to create a GameChat that has the same id as an existing one', async () => {
            await expect(gameChatService.create({
                ...defaultGameChat,
                id: 6,
            })).rejects.toThrow();
        });
    });

    describe('upsert', () => {
        it('should create a GameChat', async () => {
            const result = await gameChatService.upsert(defaultGameChat);
            expect(result).toEqual(defaultGameChat);
        });

        it('should update an existing GameChat where one with the id already existed', async () => {
            const updatedGameChat: GameChatType = {
                ...defaultGameChat,
                id: 6,
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

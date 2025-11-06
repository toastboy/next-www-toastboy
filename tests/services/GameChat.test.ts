import prisma from 'lib/prisma';
import { GameChatType } from 'prisma/generated/schemas/models/GameChat.schema';
import gameChatService from 'services/GameChat';

jest.mock('lib/prisma', () => ({
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

const defaultGameChat: GameChatType = {
    id: 1,
    gameDay: 1,
    stamp: new Date(),
    player: 1,
    body: "Hello, world!",
};

const gameChatList: GameChatType[] = Array.from({ length: 100 }, (_, index) => ({
    ...defaultGameChat,
    id: index + 1,
    gameDay: index + 1,
    player: index + 1,
}));

describe('GameChatService', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (prisma.gameChat.findUnique as jest.Mock).mockImplementation((args: {
            where: { id: number }
        }) => {
            const gameChat = gameChatList.find((gameChat) => gameChat.id === args.where.id);
            return Promise.resolve(gameChat ? gameChat : null);
        });

        (prisma.gameChat.create as jest.Mock).mockImplementation((args: { data: GameChatType }) => {
            const gameChat = gameChatList.find((gameChat) => gameChat.id === args.data.id);

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
            const gameChat = gameChatList.find((gameChat) => gameChat.id === args.where.id);

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
            const gameChat = gameChatList.find((gameChat) => gameChat.id === args.where.id);
            return Promise.resolve(gameChat ? gameChat : null);
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
                return Promise.resolve(gameChatList);
            });
        });

        it('should return the correct, complete list of 100 GameChat', async () => {
            const result = await gameChatService.getAll();
            if (result) {
                expect(result.length).toEqual(100);
                expect(result[11].id).toEqual(12);
            }
            else {
                throw new Error("Result is null");
            }
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
        });

        it('should silently return when asked to delete a GameChat that does not exist', async () => {
            await gameChatService.delete(107);
        });
    });

    describe('deleteAll', () => {
        it('should delete all GameChats', async () => {
            await gameChatService.deleteAll();
        });
    });
});

import { GameChat } from '@prisma/client';
import debug from 'debug';
import prisma from 'lib/prisma';

const log = debug('footy:api');

export class GameChatService {
    /**
     * Validate a GameChat
     * @param gameChat The GameChat to validate
     * @returns the validated GameChat
     * @throws An error if the GameChat is invalid.
     */
    validate(gameChat: GameChat): GameChat {
        if (!gameChat.id || !Number.isInteger(gameChat.id) || gameChat.id < 0) {
            throw new Error(`Invalid id value: ${gameChat.id}`);
        }
        if (!gameChat.gameDay || !Number.isInteger(gameChat.gameDay) || gameChat.gameDay < 0) {
            throw new Error(`Invalid gameDay value: ${gameChat.gameDay}`);
        }
        if (!gameChat.player || !Number.isInteger(gameChat.player) || gameChat.player < 0) {
            throw new Error(`Invalid player value: ${gameChat.player}`);
        }

        return gameChat;
    }

    /**
     * Retrieves a GameChat by its ID.
     * @param id - The ID of the GameChat to retrieve.
     * @returns A Promise that resolves to the GameChat object if found, or null if not found.
     * @throws If there is an error while fetching the GameChat.
     */
    async get(id: number): Promise<GameChat | null> {
        try {
            return prisma.gameChat.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error fetching gameChat: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all GameChat.
     * @returns A promise that resolves to an array of GameChats or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<GameChat[] | null> {
        try {
            return prisma.gameChat.findMany({});
        } catch (error) {
            log(`Error fetching gameChats: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new gameChat.
     * @param data The data for the new gameChat.
     * @returns A promise that resolves to the created gameChat, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: GameChat): Promise<GameChat | null> {
        try {
            return await prisma.gameChat.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating gameChat: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a gameChat.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted gameChat, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: GameChat): Promise<GameChat | null> {
        try {
            return await prisma.gameChat.upsert({
                where: {
                    id: data.id,
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting gameChat: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a gameChat by its ID.
     * @param id - The ID of the gameChat to delete.
     * @throws If there is an error deleting the gameChat.
     */
    async delete(id: number): Promise<void> {
        try {
            await prisma.gameChat.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error deleting gameChat: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all gameChats.
     * @returns A promise that resolves when all gameChats are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.gameChat.deleteMany();
        } catch (error) {
            log(`Error deleting gameChats: ${error}`);
            throw error;
        }
    }
}

const gameChatService = new GameChatService();
export default gameChatService;

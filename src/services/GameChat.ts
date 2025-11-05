import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    GameChatCreateInputObjectZodSchema,
    GameChatType,
    GameChatUpdateInputObjectZodSchema,
    GameChatWhereUniqueInputObjectSchema,
} from 'prisma/generated/schemas';
import z from 'zod';

/** Non-negative integer */
const nonNegativeInteger = z.number().int().min(0);

/** Schemas for enforcing strict input */
export const GameChatCreateInputObjectStrictSchema = GameChatCreateInputObjectZodSchema.extend({ id: nonNegativeInteger });
export const GameChatUpdateInputObjectStrictSchema = GameChatUpdateInputObjectZodSchema.extend({ id: nonNegativeInteger });

const log = debug('footy:api');

export class GameChatService {
    /**
     * Retrieves a GameChat by its ID.
     * @param id - The ID of the GameChat to retrieve.
     * @returns A Promise that resolves to the GameChat object if found, or null if not found.
     * @throws If there is an error while fetching the GameChat.
     */
    async get(id: number): Promise<GameChatType | null> {
        try {
            const where = GameChatWhereUniqueInputObjectSchema.parse({ id });

            return prisma.gameChat.findUnique({ where });
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
    async getAll(): Promise<GameChatType[]> {
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
    async create(rawData: unknown): Promise<GameChatType | null> {
        try {
            const data = GameChatCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.gameChat.create({ data });
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
    async upsert(rawData: unknown): Promise<GameChatType | null> {
        try {
            const where = GameChatWhereUniqueInputObjectSchema.parse(rawData);
            const update = GameChatUpdateInputObjectStrictSchema.parse(rawData);
            const create = GameChatCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.gameChat.upsert({ where, update, create });
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
            const where = GameChatWhereUniqueInputObjectSchema.parse({ id });

            await prisma.gameChat.delete({ where });
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

import prisma from 'prisma/prisma';
import { GameChatWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { GameChatType } from 'prisma/zod/schemas/models/GameChat.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    GameChatCreateOneStrictSchema,
    type GameChatUpsertInput,
    GameChatUpsertInputSchema,
    GameChatUpsertOneStrictSchema,
    type GameChatWriteInput,
    GameChatWriteInputSchema,
} from '@/types/GameChatStrictSchema';


class GameChatService {
    /**
     * Fetches a game-chat record by ID.
     * @param id - Game-chat row identifier.
     * @returns The matching row, or `null` when it does not exist.
     */
    async get(id: number): Promise<GameChatType | null> {
        const where = GameChatWhereUniqueInputObjectSchema.parse({ id });

        return prisma.gameChat.findUnique({ where });
    }

    /**
     * Fetches all game-chat records.
     * @returns All game-chat rows.
     */
    async getAll(): Promise<GameChatType[]> {
        return prisma.gameChat.findMany({});
    }

    /**
     * Creates a game-chat record from validated write input.
     * @param data - Write payload for a game-chat row.
     * @returns The created game-chat row.
     */
    async create(data: GameChatWriteInput): Promise<GameChatType> {
        const writeData = GameChatWriteInputSchema.parse(data);
        const args = GameChatCreateOneStrictSchema.parse({ data: writeData });
        return prisma.gameChat.create(args);
    }

    /**
     * Upserts a game-chat record by ID.
     *
     * Note: `id` is only used in `where`. Because create payloads never include
     * `id`, when no row matches the provided id Prisma will insert a new row with
     * a database-generated autoincrement id.
     * @param data - Upsert payload; requires `id` for the unique key.
     * @returns The created or updated game-chat row.
     */
    async upsert(data: GameChatUpsertInput): Promise<GameChatType> {
        const { id, ...writeData } = GameChatUpsertInputSchema.parse(data);
        const args = GameChatUpsertOneStrictSchema.parse({
            where: { id },
            create: writeData,
            update: writeData,
        });
        return prisma.gameChat.upsert(args);
    }

    /**
     * Deletes a game-chat record by ID.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param id - Game-chat row identifier.
     * @returns Resolves when deletion handling completes.
     * @throws If Prisma delete fails for reasons other than not-found.
     */
    async delete(id: number): Promise<void> {
        try {
            const where = GameChatWhereUniqueInputObjectSchema.parse({ id });
            await prisma.gameChat.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) return;
            throw error;
        }
    }

    /**
     * Deletes all game-chat records.
     * @returns Resolves when deletion completes.
     */
    async deleteAll(): Promise<void> {
        await prisma.gameChat.deleteMany();
    }
}

const gameChatService = new GameChatService();
export default gameChatService;

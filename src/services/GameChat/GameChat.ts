import prisma from 'prisma/prisma';
import { GameChatWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { GameChatType } from 'prisma/zod/schemas/models/GameChat.schema';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    GameChatCreateOneStrictSchema,
    type GameChatUpsertInput,
    GameChatUpsertInputSchema,
    GameChatUpsertOneStrictSchema,
    type GameChatWriteInput,
    GameChatWriteInputSchema,
} from '@/types/GameChatStrictSchema';


export class GameChatService {
    /**
     * Fetches a game-chat record by ID.
     * @param id - Game-chat row identifier.
     * @returns The matching row, or `null` when it does not exist.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async get(id: number): Promise<GameChatType | null> {
        try {
            const where = GameChatWhereUniqueInputObjectSchema.parse({ id });

            return prisma.gameChat.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all game-chat records.
     * @returns All game-chat rows.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAll(): Promise<GameChatType[]> {
        try {
            return prisma.gameChat.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates a game-chat record from validated write input.
     * @param data - Write payload for a game-chat row.
     * @returns The created game-chat row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: GameChatWriteInput): Promise<GameChatType> {
        try {
            const writeData = GameChatWriteInputSchema.parse(data);
            const args = GameChatCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.gameChat.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts a game-chat record by ID.
     *
     * Note: `id` is only used in `where`. Because create payloads never include
     * `id`, when no row matches the provided id Prisma will insert a new row with
     * a database-generated autoincrement id.
     * @param data - Upsert payload; requires `id` for the unique key.
     * @returns The created or updated game-chat row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(data: GameChatUpsertInput): Promise<GameChatType> {
        try {
            const { id, ...writeData } = GameChatUpsertInputSchema.parse(data);
            const args = GameChatUpsertOneStrictSchema.parse({
                where: { id },
                create: writeData,
                update: writeData,
            });
            return await prisma.gameChat.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes a game-chat record by ID.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param id - Game-chat row identifier.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(id: number): Promise<void> {
        try {
            const where = GameChatWhereUniqueInputObjectSchema.parse({ id });

            await prisma.gameChat.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all game-chat records.
     * @returns Resolves when deletion completes.
     * @throws {Error} If Prisma deleteMany fails.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.gameChat.deleteMany();
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const gameChatService = new GameChatService();
export default gameChatService;

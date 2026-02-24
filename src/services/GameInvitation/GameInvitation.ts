import prisma from 'prisma/prisma';
import { GameInvitationWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { GameInvitationType } from 'prisma/zod/schemas/models/GameInvitation.schema';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    GameInvitationCreateManyStrictSchema,
    type GameInvitationCreateManyWriteInput,
    GameInvitationCreateManyWriteInputSchema,
    GameInvitationCreateOneStrictSchema,
    GameInvitationUpsertOneStrictSchema,
    type GameInvitationWriteInput,
    GameInvitationWriteInputSchema,
} from '@/types/GameInvitationStrictSchema';


export class GameInvitationService {
    /**
     * Fetches a game invitation by UUID.
     * @param uuid - Invitation UUID.
     * @returns The matching invitation row, or `null` when no row exists.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async get(uuid: string): Promise<GameInvitationType | null> {
        try {
            const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid });
            return prisma.gameInvitation.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all game invitations.
     * @returns All game-invitation rows.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAll(): Promise<GameInvitationType[]> {
        try {
            return prisma.gameInvitation.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates a game invitation from validated write input.
     * @param data - Write payload containing `uuid`, `playerId`, and `gameDayId`.
     * @returns The created invitation row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: GameInvitationWriteInput): Promise<GameInvitationType> {
        try {
            const writeData = GameInvitationWriteInputSchema.parse(data);
            const args = GameInvitationCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.gameInvitation.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates many game invitations in one query.
     * @param data - Array of write payloads.
     * @returns Number of rows created.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma createMany fails.
     */
    async createMany(data: GameInvitationCreateManyWriteInput): Promise<number> {
        try {
            const writeData = GameInvitationCreateManyWriteInputSchema.parse(data);
            const args = GameInvitationCreateManyStrictSchema.parse({ data: writeData });
            const result = await prisma.gameInvitation.createMany(args);
            return result.count;
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts a game invitation by UUID.
     * @param data - Write payload containing `uuid`, `playerId`, and `gameDayId`.
     * @returns The created or updated invitation row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(data: GameInvitationWriteInput): Promise<GameInvitationType> {
        try {
            const writeData = GameInvitationWriteInputSchema.parse(data);
            const args = GameInvitationUpsertOneStrictSchema.parse({
                where: { uuid: writeData.uuid },
                create: writeData,
                update: writeData,
            });
            return await prisma.gameInvitation.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes a game invitation by UUID.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param uuid - Invitation UUID.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(uuid: string): Promise<void> {
        try {
            const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid });
            await prisma.gameInvitation.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all game invitations.
     * @returns Resolves when bulk deletion completes.
     * @throws {Error} If Prisma deleteMany fails.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.gameInvitation.deleteMany();
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const gameInvitationService = new GameInvitationService();
export default gameInvitationService;

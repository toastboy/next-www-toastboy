import prisma from 'prisma/prisma';
import { GameInvitationWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { GameInvitationType } from 'prisma/zod/schemas/models/GameInvitation.schema';

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


class GameInvitationService {
    /**
     * Fetches a game invitation by UUID.
     * @param uuid - Invitation UUID.
     * @returns The matching invitation row, or `null` when no row exists.
     */
    async get(uuid: string): Promise<GameInvitationType | null> {
        const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid });
        return prisma.gameInvitation.findUnique({ where });
    }

    /**
     * Fetches all game invitations.
     * @returns All game-invitation rows.
     */
    async getAll(): Promise<GameInvitationType[]> {
        return prisma.gameInvitation.findMany({});
    }

    /**
     * Creates a game invitation from validated write input.
     * @param data - Write payload containing `uuid`, `playerId`, and `gameDayId`.
     * @returns The created invitation row.
     */
    async create(data: GameInvitationWriteInput): Promise<GameInvitationType> {
        const writeData = GameInvitationWriteInputSchema.parse(data);
        const args = GameInvitationCreateOneStrictSchema.parse({ data: writeData });
        return prisma.gameInvitation.create(args);
    }

    /**
     * Creates many game invitations in one query.
     * @param data - Array of write payloads.
     * @returns Number of rows created.
     */
    async createMany(data: GameInvitationCreateManyWriteInput): Promise<number> {
        const writeData = GameInvitationCreateManyWriteInputSchema.parse(data);
        const args = GameInvitationCreateManyStrictSchema.parse({ data: writeData });
        const result = await prisma.gameInvitation.createMany(args);
        return result.count;
    }

    /**
     * Upserts a game invitation by UUID.
     * @param data - Write payload containing `uuid`, `playerId`, and `gameDayId`.
     * @returns The created or updated invitation row.
     */
    async upsert(data: GameInvitationWriteInput): Promise<GameInvitationType> {
        const writeData = GameInvitationWriteInputSchema.parse(data);
        const args = GameInvitationUpsertOneStrictSchema.parse({
            where: { uuid: writeData.uuid },
            create: writeData,
            update: writeData,
        });
        return prisma.gameInvitation.upsert(args);
    }

    /**
     * Deletes a game invitation by UUID.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param uuid - Invitation UUID.
     * @returns Resolves when deletion handling completes.
     * @throws If Prisma delete fails for reasons other than not-found.
     */
    async delete(uuid: string): Promise<void> {
        try {
            const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid });
            await prisma.gameInvitation.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw error;
        }
    }

    /**
     * Deletes all game invitations.
     * @returns Resolves when bulk deletion completes.
     */
    async deleteAll(): Promise<void> {
        await prisma.gameInvitation.deleteMany();
    }
}

const gameInvitationService = new GameInvitationService();
export default gameInvitationService;

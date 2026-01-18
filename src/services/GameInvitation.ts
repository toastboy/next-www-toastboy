import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    GameInvitationUncheckedCreateInputObjectZodSchema,
    GameInvitationUncheckedUpdateInputObjectZodSchema,
    GameInvitationWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import {
    GameInvitationSchema,
    GameInvitationType,
} from 'prisma/zod/schemas/models/GameInvitation.schema';
import z from 'zod';

/** Field definitions with extra validation */
const extendedFields = {
    uuid: z.string().min(36).max(36),
    playerId: z.number().int().min(1),
    gameDayId: z.number().int().min(1),
};

/** Schemas for enforcing strict input */
export const GameInvitationUncheckedCreateInputObjectStrictSchema =
    GameInvitationUncheckedCreateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const GameInvitationUncheckedUpdateInputObjectStrictSchema =
    GameInvitationUncheckedUpdateInputObjectZodSchema.extend({
        ...extendedFields,
    });

const log = debug('footy:api');

export class GameInvitationService {
    /**
     * Retrieves a game invitation by its ID.
     * @param uuid - The ID of the invitation to retrieve.
     * @returns A Promise that resolves to the invitation object if found, or null if not found.
     * @throws If there is an error while fetching the invitation.
     */
    async get(uuid: string): Promise<GameInvitationType | null> {
        try {
            const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid });

            return prisma.gameInvitation.findUnique({ where });
        } catch (error) {
            log(`Error fetching GameInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all game invitations.
     * @returns A promise that resolves to an array of invitations or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<GameInvitationType[]> {
        try {
            return prisma.gameInvitation.findMany({});
        } catch (error) {
            log(`Error fetching GameInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a new invitation.
     * @param data The data for the new invitation.
     * @returns A promise that resolves to the created invitation, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<GameInvitationType | null> {
        try {
            const data = GameInvitationUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.gameInvitation.create({ data });
        } catch (error) {
            log(`Error creating GameInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates many invitations in a single query.
     * @param rawData The data for the new invitations.
     * @returns A promise that resolves to the number of created invitations.
     */
    async createMany(rawData: unknown): Promise<number> {
        try {
            const data = z.array(GameInvitationUncheckedCreateInputObjectStrictSchema).parse(rawData);
            const result = await prisma.gameInvitation.createMany({ data });
            return result.count;
        } catch (error) {
            log(`Error creating GameInvitations: ${String(error)}`);
            throw error;
        }
    }

    async upsertByUUID(rawData: unknown): Promise<GameInvitationType | null> {
        const parsed = GameInvitationSchema.parse(rawData);
        const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid: parsed.uuid });
        return await upsert(where, rawData);
    }

    async upsertByGameAndPlayer(rawData: unknown): Promise<GameInvitationType | null> {
        const parsed = GameInvitationSchema.parse(rawData);
        const where = GameInvitationWhereUniqueInputObjectSchema.parse({
            gameDayId_playerId: {
                playerId: parsed.playerId,
                gameDayId: parsed.gameDayId,
            },
        });
        return await upsert(where, rawData);
    }

    /**
     * Deletes a game invitation by its ID.
     * @param uuid - The ID of the invitation to delete.
     * @throws If there is an error deleting the invitation.
     */
    async delete(uuid: string): Promise<void> {
        try {
            const where = GameInvitationWhereUniqueInputObjectSchema.parse({ uuid });

            await prisma.gameInvitation.delete({ where });
        } catch (error) {
            log(`Error deleting GameInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all game invitations.
     * @returns A promise that resolves when all invitations are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.gameInvitation.deleteMany();
        } catch (error) {
            log(`Error deleting GameInvitations: ${String(error)}`);
            throw error;
        }
    }
}

async function upsert(
    where: z.infer<typeof GameInvitationWhereUniqueInputObjectSchema>,
    rawData: unknown,
): Promise<GameInvitationType | null> {
    try {
        const update = GameInvitationUncheckedUpdateInputObjectZodSchema.parse(rawData);
        const create = GameInvitationUncheckedCreateInputObjectZodSchema.parse(rawData);

        return await prisma.gameInvitation.upsert({ where, update, create });
    } catch (error) {
        log(`Error upserting GameInvitation: ${String(error)}`);
        throw error;
    }
}

const gameInvitationService = new GameInvitationService();
export default gameInvitationService;

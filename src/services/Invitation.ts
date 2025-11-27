import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    InvitationUncheckedCreateInputObjectZodSchema,
    InvitationUncheckedUpdateInputObjectZodSchema,
    InvitationWhereUniqueInputObjectSchema,
} from 'prisma/generated/schemas';
import {
    InvitationSchema,
    InvitationType,
} from 'prisma/generated/schemas/models/Invitation.schema';
import z from 'zod';

/** Field definitions with extra validation */
const extendedFields = {
    uuid: z.string().min(38).max(38),
    playerId: z.number().int().min(1),
    gameDayId: z.number().int().min(1),
};

/** Schemas for enforcing strict input */
export const InvitationUncheckedCreateInputObjectStrictSchema =
    InvitationUncheckedCreateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const InvitationUncheckedUpdateInputObjectStrictSchema =
    InvitationUncheckedUpdateInputObjectZodSchema.extend({
        ...extendedFields,
    });

const log = debug('footy:api');

export class InvitationService {
    /**
     * Retrieves a Invitation by its ID.
     * @param uuid - The ID of the Invitation to retrieve.
     * @returns A Promise that resolves to the Invitation object if found, or null if not found.
     * @throws If there is an error while fetching the Invitation.
     */
    async get(uuid: string): Promise<InvitationType | null> {
        try {
            const where = InvitationWhereUniqueInputObjectSchema.parse({ uuid });

            return prisma.invitation.findUnique({ where });
        } catch (error) {
            log(`Error fetching Invitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all Invitation.
     * @returns A promise that resolves to an array of Invitations or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<InvitationType[]> {
        try {
            return prisma.invitation.findMany({});
        } catch (error) {
            log(`Error fetching Invitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a new invitation.
     * @param data The data for the new invitation.
     * @returns A promise that resolves to the created invitation, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<InvitationType | null> {
        try {
            const data = InvitationUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.invitation.create({ data });
        } catch (error) {
            log(`Error creating Invitation: ${String(error)}`);
            throw error;
        }
    }

    async upsertByUUID(rawData: unknown): Promise<InvitationType | null> {
        const parsed = InvitationSchema.parse(rawData);
        const where = InvitationWhereUniqueInputObjectSchema.parse({ uuid: parsed.uuid });
        return await upsert(where, rawData);
    }

    async upsertByGameAndPlayer(rawData: unknown): Promise<InvitationType | null> {
        const parsed = InvitationSchema.parse(rawData);
        const where = InvitationWhereUniqueInputObjectSchema.parse({
            gameDayId_playerId: {
                playerId: parsed.playerId,
                gameDayId: parsed.gameDayId,
            },
        });
        return await upsert(where, rawData);
    }

    /**
     * Deletes a invitation by its ID.
     * @param uuid - The ID of the invitation to delete.
     * @throws If there is an error deleting the invitation.
     */
    async delete(uuid: string): Promise<void> {
        try {
            const where = InvitationWhereUniqueInputObjectSchema.parse({ uuid });

            await prisma.invitation.delete({ where });
        } catch (error) {
            log(`Error deleting Invitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all invitations.
     * @returns A promise that resolves when all invitations are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.invitation.deleteMany();
        } catch (error) {
            log(`Error deleting Invitations: ${String(error)}`);
            throw error;
        }
    }
}

async function upsert(
    where: z.infer<typeof InvitationWhereUniqueInputObjectSchema>,
    rawData: unknown,
): Promise<InvitationType | null> {
    try {
        const update = InvitationUncheckedUpdateInputObjectZodSchema.parse(rawData);
        const create = InvitationUncheckedCreateInputObjectZodSchema.parse(rawData);

        return await prisma.invitation.upsert({ where, update, create });
    } catch (error) {
        log(`Error upserting Invitation: ${String(error)}`);
        throw error;
    }
}

const invitationService = new InvitationService();
export default invitationService;

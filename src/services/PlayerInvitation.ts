import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    PlayerInvitationUncheckedCreateInputObjectZodSchema,
    PlayerInvitationUncheckedUpdateInputObjectZodSchema,
    PlayerInvitationWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { PlayerInvitationType } from 'prisma/zod/schemas/models/PlayerInvitation.schema';
import z from 'zod';

/** Field definitions with extra validation */
const PlayerInvitationExtendedFields = {
    playerId: z.number().int().min(1),
    email: z.email(),
    tokenHash: z.string().length(64),
    expiresAt: z.date(),
    usedAt: z.date().nullish().optional(),
};

const PlayerInvitationExtendedFieldsForUpdate = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().optional(),
    tokenHash: z.string().length(64).optional(),
    expiresAt: z.date().optional(),
    usedAt: z.date().nullish().optional(),
};

/** Schemas for enforcing strict input */
export const PlayerInvitationUncheckedCreateInputObjectStrictSchema =
    PlayerInvitationUncheckedCreateInputObjectZodSchema.extend({
        ...PlayerInvitationExtendedFields,
    });
export const PlayerInvitationUncheckedUpdateInputObjectStrictSchema =
    PlayerInvitationUncheckedUpdateInputObjectZodSchema.extend({
        ...PlayerInvitationExtendedFieldsForUpdate,
    });

const log = debug('footy:api');

export class PlayerInvitationService {
    /**
     * Creates a player invitation record.
     * @param rawData The properties to add to the player invitation
     * @returns A promise that resolves to the newly-created player invitation
     */
    async createPlayerInvitation(rawData: unknown): Promise<PlayerInvitationType> {
        try {
            const data = PlayerInvitationUncheckedCreateInputObjectStrictSchema.parse(rawData);
            return await prisma.playerInvitation.create({ data });
        } catch (error) {
            log(`Error creating PlayerInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves a player invitation by its token hash.
     * @param tokenHash The token hash for the invitation
     * @returns A promise that resolves to the player invitation or null if not found
     */
    async getPlayerInvitationByTokenHash(tokenHash: string): Promise<PlayerInvitationType | null> {
        try {
            const where = PlayerInvitationWhereUniqueInputObjectSchema.parse({ tokenHash });
            return await prisma.playerInvitation.findUnique({ where });
        } catch (error) {
            log(`Error fetching PlayerInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Marks a player invitation as used.
     * @param id The invitation ID to update
     * @param usedAt The timestamp to set
     * @returns A promise that resolves to the updated invitation
     */
    async markPlayerInvitationUsed(id: number, usedAt: Date): Promise<PlayerInvitationType> {
        try {
            const where = PlayerInvitationWhereUniqueInputObjectSchema.parse({ id });
            const data = PlayerInvitationUncheckedUpdateInputObjectStrictSchema.parse({ usedAt });
            return await prisma.playerInvitation.update({ where, data });
        } catch (error) {
            log(`Error updating PlayerInvitation: ${String(error)}`);
            throw error;
        }
    }
}

const playerInvitationService = new PlayerInvitationService();
export default playerInvitationService;

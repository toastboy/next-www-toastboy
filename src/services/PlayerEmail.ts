import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    PlayerEmailUncheckedCreateInputObjectZodSchema,
    PlayerEmailUncheckedUpdateInputObjectZodSchema,
    PlayerEmailWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { PlayerEmailType } from 'prisma/zod/schemas/models/PlayerEmail.schema';
import z from 'zod';

/** Field definitions with extra validation */
const PlayerEmailExtendedFields = {
    playerId: z.number().int().min(1),
    email: z.email(),
    verifiedAt: z.date().nullish().optional(),
};

const PlayerEmailExtendedFieldsForUpdate = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().optional(),
    verifiedAt: z.date().nullish().optional(),
};

/** Schemas for enforcing strict input */
export const PlayerEmailUncheckedCreateInputObjectStrictSchema =
    PlayerEmailUncheckedCreateInputObjectZodSchema.extend({
        ...PlayerEmailExtendedFields,
    });
export const PlayerEmailUncheckedUpdateInputObjectStrictSchema =
    PlayerEmailUncheckedUpdateInputObjectZodSchema.extend({
        ...PlayerEmailExtendedFieldsForUpdate,
    });

const log = debug('footy:api');

export class PlayerEmailService {
    /**
     * Retrieves the player associated with the given email address. It's not
     * enough to just have a record with that email; the email must also be
     * verified.
     *
     * @param email - The email address of the player.
     * @returns A promise that resolves to the player email if found, or null if
     * no player is found with the given email.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async getByEmail(email: string, verified?: boolean): Promise<PlayerEmailType | null> {
        try {
            return await prisma.playerEmail.findFirst({
                where: {
                    email,
                    ...(verified ? { verifiedAt: { not: null } } : {}),
                },
            });
        } catch (error) {
            log(`Error getting PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a player email record.
     * @param rawData The properties to add to the player email
     * @returns A promise that resolves to the newly-created player email
     */
    async create(rawData: unknown): Promise<PlayerEmailType> {
        try {
            const data = PlayerEmailUncheckedCreateInputObjectStrictSchema.parse(rawData);
            return await prisma.playerEmail.create({ data });
        } catch (error) {
            log(`Error creating PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a verified player email record for the given player.
     * @param playerId The player ID to associate
     * @param email The email address to upsert
     * @param verifiedAt The verification timestamp
     * @returns A promise that resolves to the upserted player email
     */
    async upsertVerified(playerId: number, email: string, verifiedAt: Date): Promise<PlayerEmailType> {
        try {
            const where = PlayerEmailWhereUniqueInputObjectSchema.parse({ email });
            const create = PlayerEmailUncheckedCreateInputObjectStrictSchema.parse({
                playerId,
                email,
                verifiedAt,
            });
            const update = PlayerEmailUncheckedUpdateInputObjectStrictSchema.parse({
                playerId,
                verifiedAt,
            });

            return await prisma.playerEmail.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all player emails from the database.
     * @param playerId - Optional player ID to filter emails for a specific player. If not provided, retrieves all player emails.
     * @returns A promise that resolves to an array of objects containing the player ID and associated email address.
     * @throws Will throw an error if the database query fails.
     */
    async getAll(playerId?: number) {
        try {
            return await prisma.playerEmail.findMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            log(`Error fetching Player emails: ${String(error)}`);
            throw error;
        }
    }
}

const playerEmailService = new PlayerEmailService();
export default playerEmailService;

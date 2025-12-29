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

/**
 * Service class for managing player email records in the database.
 *
 * Provides methods to create, retrieve, update, and delete player email records,
 * including support for email verification status. This service handles the
 * interaction with the PlayerEmail database model through Prisma.
 *
 * @remarks
 * All methods include error handling and logging. Database operations are
 * performed using Prisma ORM with schema validation using Zod schemas.
 *
 * @example
 * ```typescript
 * const emailService = new PlayerEmailService();
 * const playerEmail = await emailService.getByEmail('player@example.com', true);
 * ```
 */
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
     * Upserts a player email record for the given player.
     * @param playerId The player ID to associate
     * @param email The email address to upsert
     * @param verified Whether the email is verified
     * @returns A promise that resolves to the upserted player email
     */
    async upsert(playerId: number, email: string, verified?: boolean): Promise<PlayerEmailType> {
        try {
            const verifiedAt = verified ? new Date() : undefined;
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
     * Upserts multiple email addresses for a specific player.
     *
     * This method attempts to upsert all provided email addresses concurrently using Promise.all.
     * If any upsert operation fails, the error is logged and re-thrown.
     *
     * @param playerId - The unique identifier of the player
     * @param emails - An array of email addresses to upsert for the player
     * @throws {Error} Re-throws any error that occurs during the upsert operations
     * @returns A promise that resolves when all email addresses have been successfully upserted
     */
    async upsertAll(playerId: number, emails: string[]) {
        try {
            await Promise.all(emails.map(
                (email) => this.upsert(playerId, email),
            ));
        } catch (error) {
            log(`Error upserting multiple PlayerEmails: ${String(error)}`);
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

    /**
     * Deletes a player email from the database.
     *
     * @param email - The email address of the player email to be deleted.
     * @returns A promise that resolves to the deleted player email object.
     * @throws Will throw an error if the deletion fails.
     */
    async delete(email: string) {
        try {
            return await prisma.playerEmail.delete({
                where: { email },
            });
        } catch (error) {
            log(`Error deleting PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all emails associated with a player except those specified in the
     * keep list.
     *
     * @param playerId - The unique identifier of the player whose emails should
     * be managed
     * @param keep - Array of email addresses that should be preserved
     * (case-insensitive, trimmed)
     * @throws {Error} Rethrows any error encountered during the deletion
     * process after logging
     * @returns A promise that resolves when all emails not in the keep list
     * have been deleted
     */
    async deleteExcept(playerId: number, keep: string[]) {
        try {
            const currentEmails = await this.getAll(playerId);
            const emailsToDelete = currentEmails
                .filter((current) => !keep.some(
                    (email) => email.trim().toLowerCase() === current.email,
                ));
            await Promise.all(emailsToDelete.map((email) => this.delete(email.email)));
        } catch (error) {
            log(`Error deleting PlayerEmails: ${String(error)}`);
            throw error;
        }
    }
}

const playerEmailService = new PlayerEmailService();
export default playerEmailService;

import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import { PlayerExtraEmailWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    PlayerExtraEmailCreateOneStrictSchema,
    PlayerExtraEmailUpsertOneStrictSchema,
    type PlayerExtraEmailWriteInput,
    PlayerExtraEmailWriteInputSchema,
} from '@/types/PlayerExtraEmailStrictSchema';

const log = debug('footy:api');

/**
 * Service class for managing player email records in the database.
 *
 * Provides methods to create, retrieve, update, and delete player email records,
 * including support for email verification status. This service handles the
 * interaction with the PlayerExtraEmail database model through Prisma.
 *
 * @remarks
 * All methods include error handling and logging. Database operations are
 * performed using Prisma ORM with schema validation using Zod schemas.
 *
 * @example
 * ```typescript
 * const emailService = new PlayerExtraEmailService();
 * const playerExtraEmail = await emailService.getByEmail('player@example.com', true);
 * ```
 */
export class PlayerExtraEmailService {
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
    async getByEmail(email: string, verified?: boolean): Promise<PlayerExtraEmailType | null> {
        try {
            return await prisma.playerExtraEmail.findFirst({
                where: {
                    email,
                    ...(verified ? { verifiedAt: { not: null } } : {}),
                },
            });
        } catch (error) {
            log(`Error getting PlayerExtraEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a player extra-email record from validated write input.
     * @param data - Write payload with `playerId`, `email`, and optional `verifiedAt`.
     * @returns The created player extra-email row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: PlayerExtraEmailWriteInput): Promise<PlayerExtraEmailType> {
        try {
            const writeData = PlayerExtraEmailWriteInputSchema.parse(data);
            const args = PlayerExtraEmailCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.playerExtraEmail.create(args);
        } catch (error) {
            log(`Error creating PlayerExtraEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a player email record for the given player.
     * @param playerId - The player ID to associate.
     * @param email - The email address to upsert (also used as unique key).
     * @param verified - Whether this upsert should mark the email verified.
     * @returns The created or updated player extra-email row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(playerId: number, email: string, verified?: boolean): Promise<PlayerExtraEmailType> {
        try {
            const verifiedAt = verified ? new Date() : undefined;
            const writeData = PlayerExtraEmailWriteInputSchema.parse({
                playerId,
                email,
                verifiedAt,
            });
            const args = PlayerExtraEmailUpsertOneStrictSchema.parse({
                where: {
                    email: writeData.email,
                },
                create: {
                    playerId: writeData.playerId,
                    email: writeData.email,
                    ...(writeData.verifiedAt ? { verifiedAt: writeData.verifiedAt } : {}),
                },
                update: {
                    playerId: writeData.playerId,
                    ...(writeData.verifiedAt ? { verifiedAt: writeData.verifiedAt } : {}),
                },
            });
            return await prisma.playerExtraEmail.upsert(args);
        } catch (error) {
            log(`Error upserting PlayerExtraEmail: ${String(error)}`);
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
            log(`Error upserting multiple PlayerExtraEmails: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all player emails from the database.
     * @param playerId - Optional player ID to filter emails for a specific player. If not provided, retrieves all player emails.
     * @returns A promise that resolves to an array of objects containing the player ID and associated email address.
     * @throws Will throw an error if the database query fails.
     */
    async getAll(playerId?: number): Promise<PlayerExtraEmailType[]> {
        try {
            return await prisma.playerExtraEmail.findMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            log(`Error fetching Player extra emails: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a player email from the database.
     *
     * @param email - The email address of the player email to be deleted.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If unique-key validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(email: string): Promise<void> {
        try {
            const where = PlayerExtraEmailWhereUniqueInputObjectSchema.parse({ email });
            await prisma.playerExtraEmail.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            log(`Error deleting PlayerExtraEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes PlayerExtraEmail records.
     *
     * If `playerId` is provided, only records for that player will be deleted.
     * If `playerId` is omitted, all PlayerExtraEmail records will be deleted.
     *
     * @param playerId - Optional ID of the player whose extra email records
     * should be deleted.
     * @returns Resolves when the bulk delete operation completes.
     * @throws {Error} Rethrows any Prisma error after logging it.
     */
    async deleteAll(playerId?: number): Promise<void> {
        try {
            await prisma.playerExtraEmail.deleteMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            log(`Error deleting all PlayerExtraEmails: ${String(error)}`);
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
            log(`Error deleting PlayerExtraEmails: ${String(error)}`);
            throw error;
        }
    }
}

const playerExtraEmailService = new PlayerExtraEmailService();
export default playerExtraEmailService;

import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    EmailVerificationUncheckedCreateInputObjectZodSchema,
    EmailVerificationUncheckedUpdateInputObjectZodSchema,
    EmailVerificationWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { EmailVerificationType } from 'prisma/zod/schemas/models/EmailVerification.schema';
import z from 'zod';

import { hashVerificationToken } from '@/lib/verificationToken';

/** Field definitions with extra validation */
const EmailVerificationExtendedFields = {
    playerId: z.number().int().min(1).optional(),
    email: z.email(),
    tokenHash: z.string().length(64),
    expiresAt: z.date(),
    usedAt: z.date().nullish().optional(),
};

const EmailVerificationExtendedFieldsForUpdate = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().optional(),
    tokenHash: z.string().length(64).optional(),
    expiresAt: z.date().optional(),
    usedAt: z.date().nullish().optional(),
};

const EmailVerificationCreateInputSchema = z
    .object({
        id: z.number().int().optional(),
        playerId: z.number().int().min(1).optional(),
        email: z.email(),
        token: z.string().min(1),
        expiresAt: z.date(),
        usedAt: z.date().nullish().optional(),
        createdAt: z.date().optional(),
    })
    .strict();

/** Schemas for enforcing strict input */
export const EmailVerificationUncheckedCreateInputObjectStrictSchema =
    EmailVerificationUncheckedCreateInputObjectZodSchema.extend({
        ...EmailVerificationExtendedFields,
    });
export const EmailVerificationUncheckedUpdateInputObjectStrictSchema =
    EmailVerificationUncheckedUpdateInputObjectZodSchema.extend({
        ...EmailVerificationExtendedFieldsForUpdate,
    });

const log = debug('footy:api');

export class EmailVerificationService {
    /**
     * Generates a hashed representation of a verification token.
     *
     * Wraps the `hashVerificationToken` utility to produce a value suitable
     * for persistent storage and secure comparison.
     *
     * @param token - The plaintext verification token to hash.
     * @returns The hashed token as a string.
     * @private
     */
    private getTokenHash(token: string) {
        return hashVerificationToken(token);
    }

    /**
     * Creates a new EmailVerification record after validating the provided raw
     * data. If a raw token is provided, it is hashed before persistence.
     *
     * @param rawData - The input data to validate and use for creating the
     * record.
     * @returns The newly created EmailVerification record.
     * @throws Will log and rethrow any validation or persistence errors
     * encountered during creation.
     */
    async create(rawData: unknown): Promise<EmailVerificationType> {
        try {
            const input = EmailVerificationCreateInputSchema.parse(rawData);
            const { token, ...rest } = input;
            const data = EmailVerificationUncheckedCreateInputObjectStrictSchema.parse({
                ...rest,
                tokenHash: this.getTokenHash(token),
            });
            return await prisma.emailVerification.create({ data });
        } catch (error) {
            log(`Error creating EmailVerification: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves an email verification record that matches the provided token.
     *
     * @param token - The raw token used to uniquely identify the email
     * verification entry.
     * @returns The matching EmailVerificationType instance, or null if no
     * record is found.
     *
     * @throws When input validation or Prisma query execution fails.
     */
    async getByToken(token: string): Promise<EmailVerificationType | null> {
        try {
            const tokenHash = this.getTokenHash(token);
            const where = EmailVerificationWhereUniqueInputObjectSchema.parse({ tokenHash });
            return await prisma.emailVerification.findUnique({ where });
        } catch (error) {
            log(`Error fetching EmailVerification: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Marks an email verification entry identified by the provided token as used.
     *
     * Validates the input and update payload using application schemas, sets `usedAt` to the current date/time,
     * performs a database update, and returns the updated EmailVerification record.
     *
     * @param token - The unique token for the email verification entry.
     * @returns The updated EmailVerification record.
     * @throws {Error} If validation fails or the database update operation fails. Errors are logged before being re-thrown.
     */
    async markUsed(token: string): Promise<EmailVerificationType> {
        try {
            const tokenHash = this.getTokenHash(token);
            const where = EmailVerificationWhereUniqueInputObjectSchema.parse({ tokenHash });
            const data = EmailVerificationUncheckedUpdateInputObjectStrictSchema.parse({
                usedAt: new Date(),
            });
            return await prisma.emailVerification.update({ where, data });
        } catch (error) {
            log(`Error updating EmailVerification: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Delete email verification records.
     *
     * If `playerId` is provided, only records belonging to that player are
     * deleted; otherwise all email verification records are deleted.
     *
     * @param playerId - Optional player ID to filter which EmailVerification
     * records to delete.
     * @returns A Promise that resolves to the deletion result (an object
     * containing the `count` of deleted records).
     * @throws Will log and rethrow any error encountered while performing the
     * deletion.
     * @example
     * // Delete all records for player with ID 123
     * await emailVerificationService.deleteAll(123);
     *
     * // Delete all email verification records
     * await emailVerificationService.deleteAll();
     */
    async deleteAll(playerId?: number) {
        try {
            return await prisma.emailVerification.deleteMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            log(`Error deleting all EmailVerifications: ${String(error)}`);
            throw error;
        }
    }
}

const emailVerificationService = new EmailVerificationService();
export default emailVerificationService;

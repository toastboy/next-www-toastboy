import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    EmailVerificationUncheckedCreateInputObjectZodSchema,
    EmailVerificationUncheckedUpdateInputObjectZodSchema,
    EmailVerificationWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { EmailVerificationPurposeSchema } from 'prisma/zod/schemas/enums/EmailVerificationPurpose.schema';
import { EmailVerificationType } from 'prisma/zod/schemas/models/EmailVerification.schema';
import z from 'zod';

/** Field definitions with extra validation */
const EmailVerificationExtendedFields = {
    playerId: z.number().int().min(1).optional(),
    email: z.email(),
    tokenHash: z.string().length(64),
    purpose: EmailVerificationPurposeSchema,
    expiresAt: z.date(),
    usedAt: z.date().nullish().optional(),
};

const EmailVerificationExtendedFieldsForUpdate = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().optional(),
    tokenHash: z.string().length(64).optional(),
    purpose: EmailVerificationPurposeSchema.optional(),
    expiresAt: z.date().optional(),
    usedAt: z.date().nullish().optional(),
};

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
     * Creates a new EmailVerification record after validating the provided raw
     * data.
     *
     * @param rawData - The input data to validate and use for creating the
     * record.
     * @returns The newly created EmailVerification record.
     * @throws Will log and rethrow any validation or persistence errors
     * encountered during creation.
     */
    async create(rawData: unknown): Promise<EmailVerificationType> {
        try {
            const data = EmailVerificationUncheckedCreateInputObjectStrictSchema.parse(rawData);
            return await prisma.emailVerification.create({ data });
        } catch (error) {
            log(`Error creating EmailVerification: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves an email verification record that matches the provided token
     * hash.
     *
     * @param tokenHash - The hashed token used to uniquely identify the email
     * verification entry.
     * @returns The matching EmailVerificationType instance, or null if no
     * record is found.
     *
     * @throws When input validation or Prisma query execution fails.
     */
    async getByTokenHash(tokenHash: string): Promise<EmailVerificationType | null> {
        try {
            const where = EmailVerificationWhereUniqueInputObjectSchema.parse({ tokenHash });
            return await prisma.emailVerification.findUnique({ where });
        } catch (error) {
            log(`Error fetching EmailVerification: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Marks an email verification record as used by updating its `usedAt`
     * timestamp.
     *
     * @param id - The unique identifier of the email verification record to
     * mark as used
     * @returns A Promise that resolves to the updated EmailVerification record
     * @throws Will throw an error if the update operation fails or if
     * validation fails
     */
    async markUsed(id: number): Promise<EmailVerificationType> {
        try {
            const where = EmailVerificationWhereUniqueInputObjectSchema.parse({ id });
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

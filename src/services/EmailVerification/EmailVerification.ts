import prisma from 'prisma/prisma';
import { EmailVerificationType } from 'prisma/zod/schemas/models/EmailVerification.schema';
import { EmailVerificationWhereUniqueInputObjectSchema } from 'prisma/zod/schemas/objects/EmailVerificationWhereUniqueInput.schema';

import { hashVerificationToken } from '@/lib/verificationToken';
import {
    EmailVerificationCreateOneStrictSchema,
    EmailVerificationMarkUsedInputSchema,
    EmailVerificationUpdateOneStrictSchema,
    type EmailVerificationWriteInput,
    EmailVerificationWriteInputSchema,
} from '@/types/EmailVerificationStrictSchema';


class EmailVerificationService {
    /**
     * Hashes a verification token for lookup and persistence.
     * @param token - Plaintext verification token.
     * @returns Deterministic token hash.
     */
    private getTokenHash(token: string) {
        return hashVerificationToken(token);
    }

    /**
     * Creates an email-verification record from validated write input.
     *
     * The raw token is never persisted directly; it is hashed and stored as
     * `tokenHash`.
     *
     * @param data - Write payload containing `email`, `token`, and expiry metadata.
     * @returns The created email-verification row.
     */
    async create(data: EmailVerificationWriteInput): Promise<EmailVerificationType> {
        const writeData = EmailVerificationWriteInputSchema.parse(data);
        const tokenHash = this.getTokenHash(writeData.token);
        const args = EmailVerificationCreateOneStrictSchema.parse({
            data: {
                playerId: writeData.playerId,
                email: writeData.email,
                tokenHash,
                expiresAt: writeData.expiresAt,
                usedAt: writeData.usedAt,
            },
        });
        return await prisma.emailVerification.create(args);
    }

    /**
     * Fetches an email-verification record by plaintext token.
     * @param token - Plaintext token identifying the record.
     * @returns The matching row, or `null` when no record exists.
     */
    async getByToken(token: string): Promise<EmailVerificationType | null> {
        const tokenHash = this.getTokenHash(token);
        const where = EmailVerificationWhereUniqueInputObjectSchema.parse({ tokenHash });
        return prisma.emailVerification.findUnique({ where });
    }

    /**
     * Marks an email-verification record as used.
     *
     * Sets `usedAt` to the current timestamp for the row matching the supplied
     * token hash.
     *
     * @param token - Plaintext token identifying the record.
     * @returns The updated email-verification row.
     */
    async markUsed(token: string): Promise<EmailVerificationType> {
        const validatedInput = EmailVerificationMarkUsedInputSchema.parse({ token });
        const tokenHash = this.getTokenHash(validatedInput.token);
        const args = EmailVerificationUpdateOneStrictSchema.parse({
            where: { tokenHash },
            data: {
                usedAt: new Date(),
            },
        });
        return prisma.emailVerification.update(args);
    }

    /**
     * Deletes email-verification records in bulk.
     *
     * @param playerId - Optional filter; when provided, only rows for this player are deleted.
     * @returns Prisma batch payload containing deleted row count.
     */
    async deleteAll(playerId?: number) {
        return prisma.emailVerification.deleteMany({
            where: playerId ? { playerId } : undefined,
        });
    }
}

const emailVerificationService = new EmailVerificationService();
export default emailVerificationService;

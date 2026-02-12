import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import { ContactEnquiryWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { ContactEnquiryType } from 'prisma/zod/schemas/models/ContactEnquiry.schema';

import { hashVerificationToken } from '@/lib/verificationToken';
import {
    ContactEnquiryCreateOneStrictSchema,
    ContactEnquiryMarkDeliveredInputSchema,
    ContactEnquiryUpdateOneStrictSchema,
    type ContactEnquiryWriteInput,
    ContactEnquiryWriteInputSchema,
} from '@/types/ContactEnquiryStrictSchema';

const log = debug('footy:api');

export class ContactEnquiryService {
    /**
     * Hashes a verification token for lookup and persistence.
     * @param token - Plaintext token to hash.
     * @returns Deterministic token hash.
     */
    private getTokenHash(token: string) {
        return hashVerificationToken(token);
    }

    /**
     * Creates a contact enquiry from validated write input.
     *
     * The raw token is never persisted directly; it is hashed and stored as
     * `tokenHash`.
     *
     * @param data - Write payload containing `name`, `email`, `message`, and `token`.
     * @returns The created contact enquiry row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: ContactEnquiryWriteInput): Promise<ContactEnquiryType> {
        try {
            const writeData = ContactEnquiryWriteInputSchema.parse(data);
            const tokenHash = this.getTokenHash(writeData.token);
            const args = ContactEnquiryCreateOneStrictSchema.parse({
                data: {
                    name: writeData.name,
                    email: writeData.email,
                    message: writeData.message,
                    tokenHash,
                },
            });
            return await prisma.contactEnquiry.create(args);
        } catch (error) {
            log(`Error creating ContactEnquiry: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Fetches a contact enquiry by verification token.
     *
     * @param token - Plaintext token that identifies the enquiry.
     * @returns The matching enquiry, or `null` when none exists.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma query fails.
     */
    async getByToken(token: string): Promise<ContactEnquiryType | null> {
        try {
            const tokenHash = this.getTokenHash(token);
            const where = ContactEnquiryWhereUniqueInputObjectSchema.parse({ tokenHash });
            return await prisma.contactEnquiry.findUnique({ where });
        } catch (error) {
            log(`Error fetching ContactEnquiry: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Marks a contact enquiry as both verified and delivered.
     *
     * Sets `verifiedAt` and `deliveredAt` to the same current timestamp.
     *
     * @param id - Contact enquiry identifier.
     * @returns The updated contact enquiry row.
     * @throws {z.ZodError} If ID or Prisma-args validation fails.
     * @throws {Error} If Prisma update fails.
     */
    async markDelivered(id: number): Promise<ContactEnquiryType> {
        try {
            const validatedInput = ContactEnquiryMarkDeliveredInputSchema.parse({ id });
            const now = new Date();
            const args = ContactEnquiryUpdateOneStrictSchema.parse({
                where: { id: validatedInput.id },
                data: {
                    verifiedAt: now,
                    deliveredAt: now,
                },
            });
            return await prisma.contactEnquiry.update(args);
        } catch (error) {
            log(`Error updating ContactEnquiry: ${String(error)}`);
            throw error;
        }
    }
}

const contactEnquiryService = new ContactEnquiryService();
export default contactEnquiryService;

import prisma from 'prisma/prisma';
import { ContactEnquiryType } from 'prisma/zod/schemas/models/ContactEnquiry.schema';
import { ContactEnquiryWhereUniqueInputObjectSchema } from 'prisma/zod/schemas/objects/ContactEnquiryWhereUniqueInput.schema';

import { hashVerificationToken } from '@/lib/verificationToken';
import {
    ContactEnquiryCreateOneStrictSchema,
    ContactEnquiryMarkDeliveredInputSchema,
    ContactEnquiryUpdateOneStrictSchema,
    type ContactEnquiryWriteInput,
    ContactEnquiryWriteInputSchema,
} from '@/types/ContactEnquiryStrictSchema';


class ContactEnquiryService {
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
     */
    async create(data: ContactEnquiryWriteInput): Promise<ContactEnquiryType> {
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
        return prisma.contactEnquiry.create(args);
    }

    /**
     * Fetches a contact enquiry by verification token.
     *
     * @param token - Plaintext token that identifies the enquiry.
     * @returns The matching enquiry, or `null` when none exists.
     */
    async getByToken(token: string): Promise<ContactEnquiryType | null> {
        const tokenHash = this.getTokenHash(token);
        const where = ContactEnquiryWhereUniqueInputObjectSchema.parse({ tokenHash });
        return prisma.contactEnquiry.findUnique({ where });
    }

    /**
     * Marks a contact enquiry as both verified and delivered.
     *
     * Sets `verifiedAt` and `deliveredAt` to the same current timestamp.
     *
     * @param id - Contact enquiry identifier.
     * @returns The updated contact enquiry row.
     */
    async markDelivered(id: number): Promise<ContactEnquiryType> {
        const validatedInput = ContactEnquiryMarkDeliveredInputSchema.parse({ id });
        const now = new Date();
        const args = ContactEnquiryUpdateOneStrictSchema.parse({
            where: { id: validatedInput.id },
            data: {
                verifiedAt: now,
                deliveredAt: now,
            },
        });
        return prisma.contactEnquiry.update(args);
    }
}

const contactEnquiryService = new ContactEnquiryService();
export default contactEnquiryService;

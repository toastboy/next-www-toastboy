import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    ContactEnquiryUncheckedCreateInputObjectZodSchema,
    ContactEnquiryUncheckedUpdateInputObjectZodSchema,
    ContactEnquiryWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { ContactEnquiryType } from 'prisma/zod/schemas/models/ContactEnquiry.schema';
import z from 'zod';

import { hashVerificationToken } from '@/lib/verificationToken';

/** Field definitions with extra validation */
const ContactEnquiryExtendedFields = {
    name: z.string().trim().min(1),
    email: z.email(),
    message: z.string().trim().min(1),
    createdAt: z.date().optional(),
    verifiedAt: z.date().nullish().optional(),
    deliveredAt: z.date().nullish().optional(),
    tokenHash: z.string().trim().min(1),
};

const ContactEnquiryExtendedFieldsForUpdate = {
    name: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    message: z.string().trim().min(1).optional(),
    createdAt: z.date().optional(),
    verifiedAt: z.date().nullish().optional(),
    deliveredAt: z.date().nullish().optional(),
    tokenHash: z.string().trim().min(1).optional(),
};

const ContactEnquiryCreateInputSchema = z
    .object({
        id: z.number().int().optional(),
        name: z.string().trim().min(1),
        email: z.email(),
        message: z.string().trim().min(1),
        token: z.string().min(1),
        createdAt: z.date().optional(),
        verifiedAt: z.date().nullish().optional(),
        deliveredAt: z.date().nullish().optional(),
    })
    .strict();

/** Schemas for enforcing strict input */
export const ContactEnquiryUncheckedCreateInputObjectStrictSchema =
    ContactEnquiryUncheckedCreateInputObjectZodSchema.extend({
        ...ContactEnquiryExtendedFields,
    });
export const ContactEnquiryUncheckedUpdateInputObjectStrictSchema =
    ContactEnquiryUncheckedUpdateInputObjectZodSchema.extend({
        ...ContactEnquiryExtendedFieldsForUpdate,
    });

const log = debug('footy:api');

export class ContactEnquiryService {
    /**
     * Generates a secure hash for a verification token.
     *
     * Delegates to `hashVerificationToken` to produce a hashed representation
     * suitable for storage or comparison during verification flows.
     *
     * @param token - The verification token to hash.
     * @returns The hashed representation of the provided token.
     * @internal
     */
    private getTokenHash(token: string) {
        return hashVerificationToken(token);
    }

    /**
     * Creates a new contact enquiry record after validating the provided raw
     * data. If a raw token is provided, it is hashed before persistence.
     *
     * @param rawData - The input data to validate and use for creating the
     * record.
     * @returns The newly created ContactEnquiry record.
     * @throws Will log and rethrow any validation or persistence errors
     * encountered during creation.
     */
    async create(rawData: unknown): Promise<ContactEnquiryType> {
        try {
            const input = ContactEnquiryCreateInputSchema.parse(rawData);
            const { token, ...rest } = input;
            const data = ContactEnquiryUncheckedCreateInputObjectStrictSchema.parse({
                ...rest,
                tokenHash: this.getTokenHash(token),
            });
            return await prisma.contactEnquiry.create({ data });
        } catch (error) {
            log(`Error creating ContactEnquiry: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves a contact enquiry by its verification ID.
     *
     * @param token - The unique token associated with the enquiry.
     * @returns The matching ContactEnquiryType instance, or null if no record
     * is found.
     * @throws When input validation or Prisma query execution fails.
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
     * Marks a contact enquiry as verified and delivered.
     *
     * @param id - The unique identifier of the enquiry to update.
     * @returns The updated ContactEnquiry record.
     * @throws Will log and rethrow any validation or persistence errors
     * encountered during update.
     */
    async markDelivered(id: number): Promise<ContactEnquiryType> {
        try {
            const where = ContactEnquiryWhereUniqueInputObjectSchema.parse({ id });
            const now = new Date();
            const data = ContactEnquiryUncheckedUpdateInputObjectStrictSchema.parse({
                verifiedAt: now,
                deliveredAt: now,
            });
            return await prisma.contactEnquiry.update({ where, data });
        } catch (error) {
            log(`Error updating ContactEnquiry: ${String(error)}`);
            throw error;
        }
    }
}

const contactEnquiryService = new ContactEnquiryService();
export default contactEnquiryService;

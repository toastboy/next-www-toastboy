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

/** Field definitions with extra validation */
const ContactEnquiryExtendedFields = {
    name: z.string().trim().min(1),
    email: z.email(),
    message: z.string().trim().min(1),
    createdAt: z.date().optional(),
    verifiedAt: z.date().nullish().optional(),
    deliveredAt: z.date().nullish().optional(),
    verificationId: z.number().int().min(1),
};

const ContactEnquiryExtendedFieldsForUpdate = {
    name: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    message: z.string().trim().min(1).optional(),
    createdAt: z.date().optional(),
    verifiedAt: z.date().nullish().optional(),
    deliveredAt: z.date().nullish().optional(),
    verificationId: z.number().int().min(1).optional(),
};

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
     * Creates a new contact enquiry record after validating the provided raw
     * data.
     *
     * @param rawData - The input data to validate and use for creating the
     * record.
     * @returns The newly created ContactEnquiry record.
     * @throws Will log and rethrow any validation or persistence errors
     * encountered during creation.
     */
    async create(rawData: unknown): Promise<ContactEnquiryType> {
        try {
            const data = ContactEnquiryUncheckedCreateInputObjectStrictSchema.parse(rawData);
            return await prisma.contactEnquiry.create({ data });
        } catch (error) {
            log(`Error creating ContactEnquiry: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves a contact enquiry by its verification ID.
     *
     * @param verificationId - The unique verification ID associated with the
     * enquiry.
     * @returns The matching ContactEnquiryType instance, or null if no record
     * is found.
     * @throws When input validation or Prisma query execution fails.
     */
    async getByVerificationId(verificationId: number): Promise<ContactEnquiryType | null> {
        try {
            const where = ContactEnquiryWhereUniqueInputObjectSchema.parse({ verificationId });
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

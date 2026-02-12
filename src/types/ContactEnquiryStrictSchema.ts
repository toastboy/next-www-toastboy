import { Prisma } from 'prisma/generated/client';
import {
    ContactEnquiryCreateInputObjectZodSchema,
    ContactEnquiryCreateOneZodSchema,
    ContactEnquiryUncheckedCreateInputObjectZodSchema,
    ContactEnquiryUncheckedUpdateInputObjectZodSchema,
    ContactEnquiryUpdateInputObjectZodSchema,
    ContactEnquiryUpdateOneZodSchema,
    ContactEnquiryUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const CONTACT_ENQUIRY_TOKEN_HASH_LENGTH = 64;

const ContactEnquiryCreateStrictFields = {
    name: z.string().trim().min(1).max(255),
    email: z.string().email().max(255),
    message: z.string().trim().min(1),
    createdAt: z.date().optional(),
    verifiedAt: z.date().nullish(),
    deliveredAt: z.date().nullish(),
    tokenHash: z.string().length(CONTACT_ENQUIRY_TOKEN_HASH_LENGTH),
};

const ContactEnquiryUpdateStrictFields = {
    name: z.string().trim().min(1).max(255).optional(),
    email: z.string().email().max(255).optional(),
    message: z.string().trim().min(1).optional(),
    createdAt: z.date().optional(),
    verifiedAt: z.date().nullish(),
    deliveredAt: z.date().nullish(),
    tokenHash: z.string().length(CONTACT_ENQUIRY_TOKEN_HASH_LENGTH).optional(),
};

export const ContactEnquiryWriteInputSchema = z.object({
    name: ContactEnquiryCreateStrictFields.name,
    email: ContactEnquiryCreateStrictFields.email,
    message: ContactEnquiryCreateStrictFields.message,
    token: z.string().trim().min(1),
}).strict();

export type ContactEnquiryWriteInput = z.infer<typeof ContactEnquiryWriteInputSchema>;

export const ContactEnquiryMarkDeliveredInputSchema = z.object({
    id: z.number().int().min(1),
}).strict();

export type ContactEnquiryMarkDeliveredInput = z.infer<typeof ContactEnquiryMarkDeliveredInputSchema>;

const ContactEnquiryUncheckedCreateInputWithoutIdSchema =
    ContactEnquiryUncheckedCreateInputObjectZodSchema.omit({ id: true });

const ContactEnquiryUncheckedUpdateInputWithoutIdSchema =
    ContactEnquiryUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const ContactEnquiryCreateDataStrictSchema = z.union([
    ContactEnquiryCreateInputObjectZodSchema.extend(ContactEnquiryCreateStrictFields),
    ContactEnquiryUncheckedCreateInputWithoutIdSchema.extend(ContactEnquiryCreateStrictFields),
]);

const ContactEnquiryCreateOneStrictZodSchema = ContactEnquiryCreateOneZodSchema.extend({
    data: ContactEnquiryCreateDataStrictSchema,
});

export const ContactEnquiryCreateOneStrictSchema: z.ZodType<Prisma.ContactEnquiryCreateArgs> =
    ContactEnquiryCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.ContactEnquiryCreateArgs>;

const ContactEnquiryUpdateDataStrictSchema = z.union([
    ContactEnquiryUpdateInputObjectZodSchema.extend(ContactEnquiryUpdateStrictFields),
    ContactEnquiryUncheckedUpdateInputWithoutIdSchema.extend(ContactEnquiryUpdateStrictFields),
]);

const ContactEnquiryUpdateOneStrictZodSchema = ContactEnquiryUpdateOneZodSchema.extend({
    data: ContactEnquiryUpdateDataStrictSchema,
});

export const ContactEnquiryUpdateOneStrictSchema: z.ZodType<Prisma.ContactEnquiryUpdateArgs> =
    ContactEnquiryUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.ContactEnquiryUpdateArgs>;

const ContactEnquiryUpsertOneStrictZodSchema = ContactEnquiryUpsertOneZodSchema.extend({
    create: ContactEnquiryCreateDataStrictSchema,
    update: ContactEnquiryUpdateDataStrictSchema,
});

export const ContactEnquiryUpsertOneStrictSchema: z.ZodType<Prisma.ContactEnquiryUpsertArgs> =
    ContactEnquiryUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.ContactEnquiryUpsertArgs>;

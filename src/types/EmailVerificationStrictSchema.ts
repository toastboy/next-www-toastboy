import { Prisma } from 'prisma/generated/client';
import { EmailVerificationCreateOneZodSchema } from 'prisma/zod/schemas/createOneEmailVerification.schema';
import { EmailVerificationCreateInputObjectZodSchema } from 'prisma/zod/schemas/objects/EmailVerificationCreateInput.schema';
import { EmailVerificationUncheckedCreateInputObjectZodSchema } from 'prisma/zod/schemas/objects/EmailVerificationUncheckedCreateInput.schema';
import { EmailVerificationUncheckedUpdateInputObjectZodSchema } from 'prisma/zod/schemas/objects/EmailVerificationUncheckedUpdateInput.schema';
import { EmailVerificationUpdateInputObjectZodSchema } from 'prisma/zod/schemas/objects/EmailVerificationUpdateInput.schema';
import { EmailVerificationUpdateOneZodSchema } from 'prisma/zod/schemas/updateOneEmailVerification.schema';
import { EmailVerificationUpsertOneZodSchema } from 'prisma/zod/schemas/upsertOneEmailVerification.schema';
import z from 'zod';

const EMAIL_VERIFICATION_TOKEN_HASH_LENGTH = 64;

const EmailVerificationCreateStrictFields = {
    playerId: z.number().int().min(1).nullish(),
    email: z.string().email().max(255),
    tokenHash: z.string().length(EMAIL_VERIFICATION_TOKEN_HASH_LENGTH),
    expiresAt: z.date(),
    usedAt: z.date().nullish(),
    createdAt: z.date().optional(),
};

const EmailVerificationUpdateStrictFields = {
    playerId: z.number().int().min(1).nullish(),
    email: z.string().email().max(255).optional(),
    tokenHash: z.string().length(EMAIL_VERIFICATION_TOKEN_HASH_LENGTH).optional(),
    expiresAt: z.date().optional(),
    usedAt: z.date().nullish(),
    createdAt: z.date().optional(),
};

export const EmailVerificationWriteInputSchema = z.object({
    playerId: EmailVerificationCreateStrictFields.playerId,
    email: EmailVerificationCreateStrictFields.email,
    token: z.string().trim().min(1),
    expiresAt: EmailVerificationCreateStrictFields.expiresAt,
    usedAt: EmailVerificationCreateStrictFields.usedAt,
}).strict();

export type EmailVerificationWriteInput = z.infer<typeof EmailVerificationWriteInputSchema>;

export const EmailVerificationMarkUsedInputSchema = z.object({
    token: z.string().trim().min(1),
}).strict();

export type EmailVerificationMarkUsedInput = z.infer<typeof EmailVerificationMarkUsedInputSchema>;

const EmailVerificationUncheckedCreateInputWithoutIdSchema =
    EmailVerificationUncheckedCreateInputObjectZodSchema.omit({ id: true });

const EmailVerificationUncheckedUpdateInputWithoutIdSchema =
    EmailVerificationUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const EmailVerificationCreateDataStrictSchema = z.union([
    EmailVerificationCreateInputObjectZodSchema.extend(EmailVerificationCreateStrictFields),
    EmailVerificationUncheckedCreateInputWithoutIdSchema.extend(EmailVerificationCreateStrictFields),
]);

const EmailVerificationCreateOneStrictZodSchema = EmailVerificationCreateOneZodSchema.extend({
    data: EmailVerificationCreateDataStrictSchema,
});

export const EmailVerificationCreateOneStrictSchema: z.ZodType<Prisma.EmailVerificationCreateArgs> =
    EmailVerificationCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.EmailVerificationCreateArgs>;

const EmailVerificationUpdateDataStrictSchema = z.union([
    EmailVerificationUpdateInputObjectZodSchema.extend(EmailVerificationUpdateStrictFields),
    EmailVerificationUncheckedUpdateInputWithoutIdSchema.extend(EmailVerificationUpdateStrictFields),
]);

const EmailVerificationUpdateOneStrictZodSchema = EmailVerificationUpdateOneZodSchema.extend({
    data: EmailVerificationUpdateDataStrictSchema,
});

export const EmailVerificationUpdateOneStrictSchema: z.ZodType<Prisma.EmailVerificationUpdateArgs> =
    EmailVerificationUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.EmailVerificationUpdateArgs>;

const EmailVerificationUpsertOneStrictZodSchema = EmailVerificationUpsertOneZodSchema.extend({
    create: EmailVerificationCreateDataStrictSchema,
    update: EmailVerificationUpdateDataStrictSchema,
});

export const EmailVerificationUpsertOneStrictSchema: z.ZodType<Prisma.EmailVerificationUpsertArgs> =
    EmailVerificationUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.EmailVerificationUpsertArgs>;

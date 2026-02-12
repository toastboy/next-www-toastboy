import { Prisma } from 'prisma/generated/client';
import {
    ClubCreateInputObjectZodSchema,
    ClubCreateOneZodSchema,
    ClubUncheckedCreateInputObjectZodSchema,
    ClubUncheckedUpdateInputObjectZodSchema,
    ClubUpdateInputObjectZodSchema,
    ClubUpdateOneZodSchema,
    ClubUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

// Strict field definitions for Club model

const ClubStrictFields = {
    soccerwayId: z.number().int().nullish(),
    clubName: z.string().max(255),
    uri: z.string().max(255).nullish(),
    country: z.string().max(255).nullish(),
};

export const ClubCreateWriteInputSchema = z.object({
    ...ClubStrictFields,
}).strip();

export type ClubCreateWriteInput = z.infer<typeof ClubCreateWriteInputSchema>;

export const ClubUpsertInputSchema = ClubCreateWriteInputSchema.extend({
    id: z.number().int().min(1),
}).strip();

export type ClubUpsertInput = z.infer<typeof ClubUpsertInputSchema>;

const ClubUncheckedCreateInputWithoutIdSchema =
    ClubUncheckedCreateInputObjectZodSchema.omit({ id: true });

const ClubUncheckedUpdateInputWithoutIdSchema =
    ClubUncheckedUpdateInputObjectZodSchema.omit({ id: true });

// Strict schemas for create operations

const ClubCreateDataStrictSchema = z.union([
    ClubCreateInputObjectZodSchema.extend(ClubStrictFields),
    ClubUncheckedCreateInputWithoutIdSchema.extend(ClubStrictFields),
]);

const ClubCreateOneStrictZodSchema = ClubCreateOneZodSchema.extend({
    data: ClubCreateDataStrictSchema,
});

export const ClubCreateOneStrictSchema: z.ZodType<Prisma.ClubCreateArgs> =
    ClubCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.ClubCreateArgs>;

// Strict schemas for update operations

const ClubUpdateDataStrictSchema = z.union([
    ClubUpdateInputObjectZodSchema.extend(ClubStrictFields),
    ClubUncheckedUpdateInputWithoutIdSchema.extend(ClubStrictFields),
]);

const ClubUpdateOneStrictZodSchema = ClubUpdateOneZodSchema.extend({
    data: ClubUpdateDataStrictSchema,
});

export const ClubUpdateOneStrictSchema: z.ZodType<Prisma.ClubUpdateArgs> =
    ClubUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.ClubUpdateArgs>;

// Strict schemas for upsert operations

const ClubUpsertOneStrictZodSchema = ClubUpsertOneZodSchema.extend({
    create: ClubCreateDataStrictSchema,
    update: ClubUpdateDataStrictSchema,
});

export const ClubUpsertOneStrictSchema: z.ZodType<Prisma.ClubUpsertArgs> =
    ClubUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.ClubUpsertArgs>;

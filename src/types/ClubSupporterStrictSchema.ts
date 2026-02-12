import { Prisma } from 'prisma/generated/client';
import {
    ClubSupporterCreateInputObjectZodSchema,
    ClubSupporterCreateOneZodSchema,
    ClubSupporterUncheckedCreateInputObjectZodSchema,
    ClubSupporterUncheckedUpdateInputObjectZodSchema,
    ClubSupporterUpdateInputObjectZodSchema,
    ClubSupporterUpdateOneZodSchema,
    ClubSupporterUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const ClubSupporterStrictFields = {
    playerId: z.number().int().min(1),
    clubId: z.number().int().min(1),
};

export const ClubSupporterWriteInputSchema = z.object({
    ...ClubSupporterStrictFields,
}).strip();

export type ClubSupporterWriteInput = z.infer<typeof ClubSupporterWriteInputSchema>;

const ClubSupporterCreateDataStrictSchema = z.union([
    ClubSupporterCreateInputObjectZodSchema.extend(ClubSupporterStrictFields),
    ClubSupporterUncheckedCreateInputObjectZodSchema.extend(ClubSupporterStrictFields),
]);

const ClubSupporterCreateOneStrictZodSchema = ClubSupporterCreateOneZodSchema.extend({
    data: ClubSupporterCreateDataStrictSchema,
});

export const ClubSupporterCreateOneStrictSchema: z.ZodType<Prisma.ClubSupporterCreateArgs> =
    ClubSupporterCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.ClubSupporterCreateArgs>;

const ClubSupporterUpdateDataStrictSchema = z.union([
    ClubSupporterUpdateInputObjectZodSchema.extend(ClubSupporterStrictFields),
    ClubSupporterUncheckedUpdateInputObjectZodSchema.extend(ClubSupporterStrictFields),
]);

const ClubSupporterUpdateOneStrictZodSchema = ClubSupporterUpdateOneZodSchema.extend({
    data: ClubSupporterUpdateDataStrictSchema,
});

export const ClubSupporterUpdateOneStrictSchema: z.ZodType<Prisma.ClubSupporterUpdateArgs> =
    ClubSupporterUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.ClubSupporterUpdateArgs>;

const ClubSupporterUpsertOneStrictZodSchema = ClubSupporterUpsertOneZodSchema.extend({
    create: ClubSupporterCreateDataStrictSchema,
    update: ClubSupporterUpdateDataStrictSchema,
});

export const ClubSupporterUpsertOneStrictSchema: z.ZodType<Prisma.ClubSupporterUpsertArgs> =
    ClubSupporterUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.ClubSupporterUpsertArgs>;

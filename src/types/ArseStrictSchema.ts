import { Prisma } from 'prisma/generated/client';
import {
    ArseCreateInputObjectZodSchema,
    ArseCreateOneZodSchema,
    ArseUncheckedCreateInputObjectZodSchema,
    ArseUncheckedUpdateInputObjectZodSchema,
    ArseUpdateInputObjectZodSchema,
    ArseUpdateOneZodSchema,
    ArseUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

// Strict field definitions for Arse model

const ArseStrictFields = {
    inGoal: z.number().int().min(0).max(10).nullish(),
    running: z.number().int().min(0).max(10).nullish(),
    shooting: z.number().int().min(0).max(10).nullish(),
    passing: z.number().int().min(0).max(10).nullish(),
    ballSkill: z.number().int().min(0).max(10).nullish(),
    attacking: z.number().int().min(0).max(10).nullish(),
    defending: z.number().int().min(0).max(10).nullish(),
};

const ArseStrictIds = {
    playerId: z.number().int().min(1),
    raterId: z.number().int().min(1),
};

const ArseUncheckedCreateInputWithoutIdSchema =
    ArseUncheckedCreateInputObjectZodSchema.omit({ id: true });

const ArseUncheckedUpdateInputWithoutIdSchema =
    ArseUncheckedUpdateInputObjectZodSchema.omit({ id: true });

export const ArseWriteInputSchema = z.object({
    ...ArseStrictFields,
    playerId: ArseStrictIds.playerId,
    raterId: ArseStrictIds.raterId,
}).strip();

export type ArseWriteInput = z.infer<typeof ArseWriteInputSchema>;

// Strict schemas for create operations

const ArseCreateDataStrictSchema = z.union([
    ArseCreateInputObjectZodSchema.extend(ArseStrictFields),
    ArseUncheckedCreateInputWithoutIdSchema.extend({
        ...ArseStrictFields,
        ...ArseStrictIds,
    }),
]);

const ArseCreateOneStrictZodSchema = ArseCreateOneZodSchema.extend({
    data: ArseCreateDataStrictSchema,
});

export const ArseCreateOneStrictSchema: z.ZodType<Prisma.ArseCreateArgs> =
    ArseCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.ArseCreateArgs>;

// Strict schemas for update operations

const ArseUpdateDataStrictSchema = z.union([
    ArseUpdateInputObjectZodSchema.extend(ArseStrictFields),
    ArseUncheckedUpdateInputWithoutIdSchema.extend({
        ...ArseStrictFields,
        ...ArseStrictIds,
    }),
]);

const ArseUpdateOneStrictZodSchema = ArseUpdateOneZodSchema.extend({
    data: ArseUpdateDataStrictSchema,
});

export const ArseUpdateOneStrictSchema: z.ZodType<Prisma.ArseUpdateArgs> =
    ArseUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.ArseUpdateArgs>;

// Strict schemas for upsert operations

const ArseUpsertOneStrictZodSchema = ArseUpsertOneZodSchema.extend({
    create: ArseCreateDataStrictSchema,
    update: ArseUpdateDataStrictSchema,
});

export const ArseUpsertOneStrictSchema: z.ZodType<Prisma.ArseUpsertArgs> =
    ArseUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.ArseUpsertArgs>;

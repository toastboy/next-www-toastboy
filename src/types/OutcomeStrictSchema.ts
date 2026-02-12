import { Prisma } from 'prisma/generated/client';
import {
    OutcomeCreateInputObjectZodSchema,
    OutcomeCreateOneZodSchema,
    OutcomeUncheckedCreateInputObjectZodSchema,
    OutcomeUncheckedUpdateInputObjectZodSchema,
    OutcomeUpdateInputObjectZodSchema,
    OutcomeUpdateOneZodSchema,
    OutcomeUpsertOneZodSchema,
    PlayerResponseSchema,
    TeamNameSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const OutcomeStrictIds = {
    gameDayId: z.number().int().min(1),
    playerId: z.number().int().min(1),
};

const OutcomeStrictFields = {
    response: PlayerResponseSchema.nullish(),
    responseInterval: z.number().int().min(0).nullish(),
    points: z.union([z.literal(0), z.literal(1), z.literal(3)]).nullish(),
    team: TeamNameSchema.nullish(),
    comment: z.string().max(127).nullish(),
    pub: z.number().int().nullish(),
    paid: z.boolean().nullish(),
    goalie: z.boolean().nullish(),
};

const OutcomeCreateStrictFields = {
    ...OutcomeStrictIds,
    ...OutcomeStrictFields,
};

const OutcomeUpdateStrictFields = {
    gameDayId: OutcomeStrictIds.gameDayId.optional(),
    playerId: OutcomeStrictIds.playerId.optional(),
    ...OutcomeStrictFields,
};

export const OutcomeWriteInputSchema = z.object({
    ...OutcomeCreateStrictFields,
}).strip();

export type OutcomeWriteInput = z.infer<typeof OutcomeWriteInputSchema>;

const OutcomeUncheckedCreateInputWithoutIdSchema =
    OutcomeUncheckedCreateInputObjectZodSchema.omit({ id: true });

const OutcomeUncheckedUpdateInputWithoutIdSchema =
    OutcomeUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const OutcomeCreateDataStrictUnionSchema = z.union([
    OutcomeCreateInputObjectZodSchema.extend(OutcomeCreateStrictFields),
    OutcomeUncheckedCreateInputWithoutIdSchema.extend(OutcomeCreateStrictFields),
]);

const OutcomeCreateOneStrictZodSchema = OutcomeCreateOneZodSchema.extend({
    data: OutcomeCreateDataStrictUnionSchema,
});

export const OutcomeCreateOneStrictSchema: z.ZodType<Prisma.OutcomeCreateArgs> =
    OutcomeCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.OutcomeCreateArgs>;

const OutcomeUpdateDataStrictSchema = z.union([
    OutcomeUpdateInputObjectZodSchema.extend(OutcomeUpdateStrictFields),
    OutcomeUncheckedUpdateInputWithoutIdSchema.extend(OutcomeUpdateStrictFields),
]);

const OutcomeUpdateOneStrictZodSchema = OutcomeUpdateOneZodSchema.extend({
    data: OutcomeUpdateDataStrictSchema,
});

export const OutcomeUpdateOneStrictSchema: z.ZodType<Prisma.OutcomeUpdateArgs> =
    OutcomeUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.OutcomeUpdateArgs>;

const OutcomeUpsertOneStrictZodSchema = OutcomeUpsertOneZodSchema.extend({
    create: OutcomeCreateDataStrictUnionSchema,
    update: OutcomeUpdateDataStrictSchema,
});

export const OutcomeUpsertOneStrictSchema: z.ZodType<Prisma.OutcomeUpsertArgs> =
    OutcomeUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.OutcomeUpsertArgs>;

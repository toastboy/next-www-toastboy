import { Prisma } from 'prisma/generated/client';
import {
    OutcomeCreateInputObjectZodSchema,
    OutcomeCreateOneZodSchema,
    OutcomeUncheckedCreateInputObjectZodSchema,
    OutcomeUncheckedUpdateInputObjectZodSchema,
    OutcomeUpdateInputObjectZodSchema,
    OutcomeUpsertOneZodSchema,
    PlayerResponseSchema,
    TeamNameSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

import { PointsSchema } from '@/types/Points';

const OutcomeStrictIds = {
    gameDayId: z.number().int().min(1),
    playerId: z.number().int().min(1),
};

const OutcomeStrictFields = {
    response: PlayerResponseSchema.nullish(),
    responseInterval: z.number().int().min(0).nullish(),
    points: PointsSchema.nullish(),
    team: TeamNameSchema.nullish(),
    comment: z.string().max(127).nullish(),
    pub: z.number().int().nullish(),
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

const OutcomeUpsertOneStrictZodSchema = OutcomeUpsertOneZodSchema.extend({
    create: OutcomeCreateDataStrictUnionSchema,
    update: OutcomeUpdateDataStrictSchema,
});

export const OutcomeUpsertOneStrictSchema: z.ZodType<Prisma.OutcomeUpsertArgs> =
    OutcomeUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.OutcomeUpsertArgs>;

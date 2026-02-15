import { Prisma } from 'prisma/generated/client';
import {
    GameDayCreateInputObjectZodSchema,
    GameDayCreateOneZodSchema,
    GameDayUncheckedCreateInputObjectZodSchema,
    GameDayUncheckedUpdateInputObjectZodSchema,
    GameDayUpdateInputObjectZodSchema,
    GameDayUpdateOneZodSchema,
    GameDayUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import { TeamNameSchema } from 'prisma/zod/schemas/enums/TeamName.schema';
import z from 'zod';

const GameDayCreateStrictFields = {
    year: z.number().int(),
    date: z.date(),
    game: z.boolean().optional(),
    cost: z.number().int().min(1),
    mailSent: z.date().nullish(),
    comment: z.string().max(255).nullish(),
    bibs: TeamNameSchema.nullish(),
    pickerGamesHistory: z.union([z.literal(5), z.literal(10)]).nullish(),
};

const GameDayUpdateStrictFields = {
    year: z.number().int().optional(),
    date: z.date().optional(),
    game: z.boolean().optional(),
    cost: z.number().int().min(1).optional(),
    mailSent: z.date().nullish(),
    comment: z.string().max(255).nullish(),
    bibs: TeamNameSchema.nullish(),
    pickerGamesHistory: z.union([z.literal(5), z.literal(10)]).nullish(),
};

export const GameDayWriteInputSchema = z.object({
    ...GameDayCreateStrictFields,
}).strip();

export type GameDayWriteInput = z.infer<typeof GameDayWriteInputSchema>;

export const GameDayUpsertInputSchema = GameDayWriteInputSchema.extend({
    id: z.number().int().min(1),
}).strip();

export type GameDayUpsertInput = z.infer<typeof GameDayUpsertInputSchema>;

export const GameDayUpdateInputSchema = z.object({
    ...GameDayUpdateStrictFields,
    id: z.number().int().min(1),
}).strip();

export type GameDayUpdateInput = z.infer<typeof GameDayUpdateInputSchema>;

const GameDayUncheckedCreateInputWithoutIdSchema =
    GameDayUncheckedCreateInputObjectZodSchema.omit({ id: true });

const GameDayUncheckedUpdateInputWithoutIdSchema =
    GameDayUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const GameDayCreateDataStrictSchema = z.union([
    GameDayCreateInputObjectZodSchema.extend(GameDayCreateStrictFields),
    GameDayUncheckedCreateInputWithoutIdSchema.extend(GameDayCreateStrictFields),
]);

const GameDayCreateOneStrictZodSchema = GameDayCreateOneZodSchema.extend({
    data: GameDayCreateDataStrictSchema,
});

export const GameDayCreateOneStrictSchema: z.ZodType<Prisma.GameDayCreateArgs> =
    GameDayCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.GameDayCreateArgs>;

const GameDayUpdateDataStrictSchema = z.union([
    GameDayUpdateInputObjectZodSchema.extend(GameDayUpdateStrictFields),
    GameDayUncheckedUpdateInputWithoutIdSchema.extend(GameDayUpdateStrictFields),
]);

const GameDayUpdateOneStrictZodSchema = GameDayUpdateOneZodSchema.extend({
    data: GameDayUpdateDataStrictSchema,
});

export const GameDayUpdateOneStrictSchema: z.ZodType<Prisma.GameDayUpdateArgs> =
    GameDayUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.GameDayUpdateArgs>;

const GameDayUpsertOneStrictZodSchema = GameDayUpsertOneZodSchema.extend({
    create: GameDayCreateDataStrictSchema,
    update: GameDayUpdateDataStrictSchema,
});

export const GameDayUpsertOneStrictSchema: z.ZodType<Prisma.GameDayUpsertArgs> =
    GameDayUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.GameDayUpsertArgs>;

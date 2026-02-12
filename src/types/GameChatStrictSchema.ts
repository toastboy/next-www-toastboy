import { Prisma } from 'prisma/generated/client';
import {
    GameChatCreateInputObjectZodSchema,
    GameChatCreateOneZodSchema,
    GameChatUncheckedCreateInputObjectZodSchema,
    GameChatUncheckedUpdateInputObjectZodSchema,
    GameChatUpdateInputObjectZodSchema,
    GameChatUpdateOneZodSchema,
    GameChatUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const GameChatWriteFields = {
    gameDay: z.number().int().min(1),
    stamp: z.date().optional(),
    player: z.number().int().min(1),
    body: z.string().nullish(),
};

export const GameChatWriteInputSchema = z.object({
    ...GameChatWriteFields,
}).strip();

export type GameChatWriteInput = z.infer<typeof GameChatWriteInputSchema>;

export const GameChatUpsertInputSchema = GameChatWriteInputSchema.extend({
    id: z.number().int().min(1),
}).strip();

export type GameChatUpsertInput = z.infer<typeof GameChatUpsertInputSchema>;

const GameChatUncheckedCreateInputWithoutIdSchema =
    GameChatUncheckedCreateInputObjectZodSchema.omit({ id: true });

const GameChatUncheckedUpdateInputWithoutIdSchema =
    GameChatUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const GameChatCreateDataStrictSchema = z.union([
    GameChatCreateInputObjectZodSchema.extend(GameChatWriteFields),
    GameChatUncheckedCreateInputWithoutIdSchema.extend(GameChatWriteFields),
]);

const GameChatCreateOneStrictZodSchema = GameChatCreateOneZodSchema.extend({
    data: GameChatCreateDataStrictSchema,
});

export const GameChatCreateOneStrictSchema: z.ZodType<Prisma.GameChatCreateArgs> =
    GameChatCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.GameChatCreateArgs>;

const GameChatUpdateDataStrictSchema = z.union([
    GameChatUpdateInputObjectZodSchema.extend(GameChatWriteFields),
    GameChatUncheckedUpdateInputWithoutIdSchema.extend(GameChatWriteFields),
]);

const GameChatUpdateOneStrictZodSchema = GameChatUpdateOneZodSchema.extend({
    data: GameChatUpdateDataStrictSchema,
});

export const GameChatUpdateOneStrictSchema: z.ZodType<Prisma.GameChatUpdateArgs> =
    GameChatUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.GameChatUpdateArgs>;

const GameChatUpsertOneStrictZodSchema = GameChatUpsertOneZodSchema.extend({
    create: GameChatCreateDataStrictSchema,
    update: GameChatUpdateDataStrictSchema,
});

export const GameChatUpsertOneStrictSchema: z.ZodType<Prisma.GameChatUpsertArgs> =
    GameChatUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.GameChatUpsertArgs>;

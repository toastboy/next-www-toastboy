import { Prisma } from 'prisma/generated/client';
import {
    PlayerCreateInputObjectZodSchema,
    PlayerCreateOneZodSchema,
    PlayerUncheckedCreateInputObjectZodSchema,
    PlayerUncheckedUpdateInputObjectZodSchema,
    PlayerUpdateInputObjectZodSchema,
    PlayerUpdateOneZodSchema,
    PlayerUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const accountEmailStrict = z.email().max(255).nullish();

const PlayerStrictFields = {
    name: z.string().nullish(),
    accountEmail: accountEmailStrict,
    anonymous: z.boolean().nullish(),
    joined: z.date().nullish(),
    finished: z.date().nullish(),
    born: z.number().int().nullish(),
    comment: z.string().nullish(),
    introducedBy: z.number().int().nullish(),
};

const PlayerStrictIds = {
    id: z.number().int().min(1),
};

export const PlayerCreateWriteInputSchema = z.object({
    ...PlayerStrictFields,
}).strip();

export type PlayerCreateWriteInput = z.infer<typeof PlayerCreateWriteInputSchema>;

export const PlayerUpdateWriteInputSchema = z.object({
    id: PlayerStrictIds.id,
    ...PlayerStrictFields,
}).strip();

export type PlayerUpdateWriteInput = z.infer<typeof PlayerUpdateWriteInputSchema>;

const PlayerUncheckedCreateInputWithoutIdSchema =
    PlayerUncheckedCreateInputObjectZodSchema.omit({ id: true });

const PlayerUncheckedUpdateInputWithoutIdSchema =
    PlayerUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const PlayerCreateDataStrictSchema = z.union([
    PlayerCreateInputObjectZodSchema.extend(PlayerStrictFields),
    PlayerUncheckedCreateInputWithoutIdSchema.extend(PlayerStrictFields),
]);

const PlayerCreateOneStrictZodSchema = PlayerCreateOneZodSchema.extend({
    data: PlayerCreateDataStrictSchema,
});

export const PlayerCreateOneStrictSchema: z.ZodType<Prisma.PlayerCreateArgs> =
    PlayerCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerCreateArgs>;

const PlayerUpdateDataStrictSchema = z.union([
    PlayerUpdateInputObjectZodSchema.extend(PlayerStrictFields),
    PlayerUncheckedUpdateInputWithoutIdSchema.extend(PlayerStrictFields),
]);

const PlayerUpdateOneStrictZodSchema = PlayerUpdateOneZodSchema.extend({
    data: PlayerUpdateDataStrictSchema,
});

export const PlayerUpdateOneStrictSchema: z.ZodType<Prisma.PlayerUpdateArgs> =
    PlayerUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerUpdateArgs>;

const PlayerUpsertOneStrictZodSchema = PlayerUpsertOneZodSchema.extend({
    create: PlayerCreateDataStrictSchema,
    update: PlayerUpdateDataStrictSchema,
});

export const PlayerUpsertOneStrictSchema: z.ZodType<Prisma.PlayerUpsertArgs> =
    PlayerUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerUpsertArgs>;

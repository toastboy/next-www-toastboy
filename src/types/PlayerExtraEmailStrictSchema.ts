import { Prisma } from 'prisma/generated/client';
import {
    PlayerExtraEmailCreateInputObjectZodSchema,
    PlayerExtraEmailCreateOneZodSchema,
    PlayerExtraEmailUncheckedCreateInputObjectZodSchema,
    PlayerExtraEmailUncheckedUpdateInputObjectZodSchema,
    PlayerExtraEmailUpdateInputObjectZodSchema,
    PlayerExtraEmailUpdateOneZodSchema,
    PlayerExtraEmailUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const PLAYER_EXTRA_EMAIL_MAX_LENGTH = 255;

const PlayerExtraEmailCreateStrictFields = {
    playerId: z.number().int().min(1),
    email: z.email().max(PLAYER_EXTRA_EMAIL_MAX_LENGTH),
    verifiedAt: z.date().nullish(),
};

const PlayerExtraEmailUpdateStrictFields = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().max(PLAYER_EXTRA_EMAIL_MAX_LENGTH).optional(),
    verifiedAt: z.date().nullish(),
};

export const PlayerExtraEmailWriteInputSchema = z.object({
    ...PlayerExtraEmailCreateStrictFields,
}).strip();

export type PlayerExtraEmailWriteInput = z.infer<typeof PlayerExtraEmailWriteInputSchema>;

const PlayerExtraEmailUncheckedCreateInputWithoutIdSchema =
    PlayerExtraEmailUncheckedCreateInputObjectZodSchema.omit({ id: true });

const PlayerExtraEmailUncheckedUpdateInputWithoutIdSchema =
    PlayerExtraEmailUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const PlayerExtraEmailCreateDataStrictSchema = z.union([
    PlayerExtraEmailCreateInputObjectZodSchema.extend(PlayerExtraEmailCreateStrictFields),
    PlayerExtraEmailUncheckedCreateInputWithoutIdSchema.extend(PlayerExtraEmailCreateStrictFields),
]);

const PlayerExtraEmailCreateOneStrictZodSchema = PlayerExtraEmailCreateOneZodSchema.extend({
    data: PlayerExtraEmailCreateDataStrictSchema,
});

export const PlayerExtraEmailCreateOneStrictSchema: z.ZodType<Prisma.PlayerExtraEmailCreateArgs> =
    PlayerExtraEmailCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerExtraEmailCreateArgs>;

const PlayerExtraEmailUpdateDataStrictSchema = z.union([
    PlayerExtraEmailUpdateInputObjectZodSchema.extend(PlayerExtraEmailUpdateStrictFields),
    PlayerExtraEmailUncheckedUpdateInputWithoutIdSchema.extend(PlayerExtraEmailUpdateStrictFields),
]);

const PlayerExtraEmailUpdateOneStrictZodSchema = PlayerExtraEmailUpdateOneZodSchema.extend({
    data: PlayerExtraEmailUpdateDataStrictSchema,
});

export const PlayerExtraEmailUpdateOneStrictSchema: z.ZodType<Prisma.PlayerExtraEmailUpdateArgs> =
    PlayerExtraEmailUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerExtraEmailUpdateArgs>;

const PlayerExtraEmailUpsertOneStrictZodSchema = PlayerExtraEmailUpsertOneZodSchema.extend({
    create: PlayerExtraEmailCreateDataStrictSchema,
    update: PlayerExtraEmailUpdateDataStrictSchema,
});

export const PlayerExtraEmailUpsertOneStrictSchema: z.ZodType<Prisma.PlayerExtraEmailUpsertArgs> =
    PlayerExtraEmailUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerExtraEmailUpsertArgs>;

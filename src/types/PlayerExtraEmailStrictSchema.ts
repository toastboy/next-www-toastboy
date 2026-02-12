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

const PlayerExtraEmailStrictIds = {
    playerId: z.number().int().min(1),
};

const PlayerExtraEmailStrictFields = {
    email: z.email().max(PLAYER_EXTRA_EMAIL_MAX_LENGTH),
    verifiedAt: z.date().nullish(),
};

const PlayerExtraEmailCreateStrictFields = {
    ...PlayerExtraEmailStrictIds,
    ...PlayerExtraEmailStrictFields,
};

const PlayerExtraEmailUpdateStrictFields = {
    playerId: PlayerExtraEmailStrictIds.playerId.optional(),
    email: PlayerExtraEmailStrictFields.email.optional(),
    verifiedAt: PlayerExtraEmailStrictFields.verifiedAt,
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

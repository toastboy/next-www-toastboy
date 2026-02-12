import { Prisma } from 'prisma/generated/client';
import {
    PlayerRecordCreateInputObjectZodSchema,
    PlayerRecordCreateOneZodSchema,
    PlayerRecordUncheckedCreateInputObjectZodSchema,
    PlayerRecordUncheckedUpdateInputObjectZodSchema,
    PlayerRecordUpdateInputObjectZodSchema,
    PlayerRecordUpdateOneZodSchema,
    PlayerRecordUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const nonNegativeInt = z.number().int().min(0);

const PlayerRecordStrictIds = {
    playerId: z.number().int().min(1),
    year: z.number().int().min(0),
    gameDayId: z.number().int().min(1),
};

const PlayerRecordStrictFields = {
    responses: nonNegativeInt.nullish(),
    played: nonNegativeInt.nullish(),
    won: nonNegativeInt.nullish(),
    drawn: nonNegativeInt.nullish(),
    lost: nonNegativeInt.nullish(),
    points: nonNegativeInt.nullish(),
    averages: z.number().min(0).nullish(),
    stalwart: nonNegativeInt.nullish(),
    pub: nonNegativeInt.nullish(),
    rankPoints: nonNegativeInt.nullish(),
    rankAverages: nonNegativeInt.nullish(),
    rankAveragesUnqualified: nonNegativeInt.nullish(),
    rankStalwart: nonNegativeInt.nullish(),
    rankSpeedy: nonNegativeInt.nullish(),
    rankSpeedyUnqualified: nonNegativeInt.nullish(),
    rankPub: nonNegativeInt.nullish(),
    speedy: z.number().min(0).nullish(),
};

const PlayerRecordCreateStrictFields = {
    ...PlayerRecordStrictIds,
    ...PlayerRecordStrictFields,
};

const PlayerRecordUpdateStrictIds = {
    playerId: PlayerRecordStrictIds.playerId.optional(),
    year: PlayerRecordStrictIds.year.optional(),
    gameDayId: PlayerRecordStrictIds.gameDayId.optional(),
};

const PlayerRecordUpdateStrictFields = {
    ...PlayerRecordUpdateStrictIds,
    ...PlayerRecordStrictFields,
};

const PlayerRecordCheckedUpdateStrictFields = {
    year: PlayerRecordUpdateStrictIds.year,
    ...PlayerRecordStrictFields,
};

export const PlayerRecordWriteInputSchema = z.object({
    ...PlayerRecordCreateStrictFields,
}).strip();

export type PlayerRecordWriteInput = z.infer<typeof PlayerRecordWriteInputSchema>;

const PlayerRecordUncheckedCreateInputWithoutIdSchema =
    PlayerRecordUncheckedCreateInputObjectZodSchema.omit({ id: true });

const PlayerRecordUncheckedUpdateInputWithoutIdSchema =
    PlayerRecordUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const PlayerRecordCreateDataStrictSchema = z.union([
    PlayerRecordCreateInputObjectZodSchema.extend(PlayerRecordCreateStrictFields),
    PlayerRecordUncheckedCreateInputWithoutIdSchema.extend(PlayerRecordCreateStrictFields),
]);

const PlayerRecordCreateOneStrictZodSchema = PlayerRecordCreateOneZodSchema.extend({
    data: PlayerRecordCreateDataStrictSchema,
});

export const PlayerRecordCreateOneStrictSchema: z.ZodType<Prisma.PlayerRecordCreateArgs> =
    PlayerRecordCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerRecordCreateArgs>;

const PlayerRecordUpdateDataStrictSchema = z.union([
    PlayerRecordUpdateInputObjectZodSchema.extend(PlayerRecordCheckedUpdateStrictFields),
    PlayerRecordUncheckedUpdateInputWithoutIdSchema.extend(PlayerRecordUpdateStrictFields),
]);

const PlayerRecordUpdateOneStrictZodSchema = PlayerRecordUpdateOneZodSchema.extend({
    data: PlayerRecordUpdateDataStrictSchema,
});

export const PlayerRecordUpdateOneStrictSchema: z.ZodType<Prisma.PlayerRecordUpdateArgs> =
    PlayerRecordUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerRecordUpdateArgs>;

const PlayerRecordUpsertOneStrictZodSchema = PlayerRecordUpsertOneZodSchema.extend({
    create: PlayerRecordCreateDataStrictSchema,
    update: PlayerRecordUpdateDataStrictSchema,
});

export const PlayerRecordUpsertOneStrictSchema: z.ZodType<Prisma.PlayerRecordUpsertArgs> =
    PlayerRecordUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerRecordUpsertArgs>;

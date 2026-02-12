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

const PlayerRecordCreateStrictFields = {
    playerId: z.number().int().min(1),
    year: z.number().int().min(0),
    gameDayId: z.number().int().min(1),
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

const PlayerRecordUpdateStrictFields = {
    playerId: z.number().int().min(1).optional(),
    year: z.number().int().min(0).optional(),
    gameDayId: z.number().int().min(1).optional(),
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

export const PlayerRecordWriteInputSchema = z.object({
    ...PlayerRecordCreateStrictFields,
}).strip();

export type PlayerRecordWriteInput = z.infer<typeof PlayerRecordWriteInputSchema>;

const PlayerRecordUncheckedCreateInputWithoutIdSchema =
    PlayerRecordUncheckedCreateInputObjectZodSchema.omit({ id: true });

const PlayerRecordUncheckedUpdateInputWithoutIdSchema =
    PlayerRecordUncheckedUpdateInputObjectZodSchema.omit({ id: true });

const PlayerRecordCreateDataStrictSchema = z.union([
    PlayerRecordCreateInputObjectZodSchema.extend({
        playerId: PlayerRecordCreateStrictFields.playerId,
        year: PlayerRecordCreateStrictFields.year,
        gameDayId: PlayerRecordCreateStrictFields.gameDayId,
        responses: PlayerRecordCreateStrictFields.responses,
        played: PlayerRecordCreateStrictFields.played,
        won: PlayerRecordCreateStrictFields.won,
        drawn: PlayerRecordCreateStrictFields.drawn,
        lost: PlayerRecordCreateStrictFields.lost,
        points: PlayerRecordCreateStrictFields.points,
        averages: PlayerRecordCreateStrictFields.averages,
        stalwart: PlayerRecordCreateStrictFields.stalwart,
        pub: PlayerRecordCreateStrictFields.pub,
        rankPoints: PlayerRecordCreateStrictFields.rankPoints,
        rankAverages: PlayerRecordCreateStrictFields.rankAverages,
        rankAveragesUnqualified: PlayerRecordCreateStrictFields.rankAveragesUnqualified,
        rankStalwart: PlayerRecordCreateStrictFields.rankStalwart,
        rankSpeedy: PlayerRecordCreateStrictFields.rankSpeedy,
        rankSpeedyUnqualified: PlayerRecordCreateStrictFields.rankSpeedyUnqualified,
        rankPub: PlayerRecordCreateStrictFields.rankPub,
        speedy: PlayerRecordCreateStrictFields.speedy,
    }),
    PlayerRecordUncheckedCreateInputWithoutIdSchema.extend(PlayerRecordCreateStrictFields),
]);

const PlayerRecordCreateOneStrictZodSchema = PlayerRecordCreateOneZodSchema.extend({
    data: PlayerRecordCreateDataStrictSchema,
});

export const PlayerRecordCreateOneStrictSchema: z.ZodType<Prisma.PlayerRecordCreateArgs> =
    PlayerRecordCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.PlayerRecordCreateArgs>;

const PlayerRecordUpdateDataStrictSchema = z.union([
    PlayerRecordUpdateInputObjectZodSchema.extend({
        year: PlayerRecordUpdateStrictFields.year,
        responses: PlayerRecordUpdateStrictFields.responses,
        played: PlayerRecordUpdateStrictFields.played,
        won: PlayerRecordUpdateStrictFields.won,
        drawn: PlayerRecordUpdateStrictFields.drawn,
        lost: PlayerRecordUpdateStrictFields.lost,
        points: PlayerRecordUpdateStrictFields.points,
        averages: PlayerRecordUpdateStrictFields.averages,
        stalwart: PlayerRecordUpdateStrictFields.stalwart,
        pub: PlayerRecordUpdateStrictFields.pub,
        rankPoints: PlayerRecordUpdateStrictFields.rankPoints,
        rankAverages: PlayerRecordUpdateStrictFields.rankAverages,
        rankAveragesUnqualified: PlayerRecordUpdateStrictFields.rankAveragesUnqualified,
        rankStalwart: PlayerRecordUpdateStrictFields.rankStalwart,
        rankSpeedy: PlayerRecordUpdateStrictFields.rankSpeedy,
        rankSpeedyUnqualified: PlayerRecordUpdateStrictFields.rankSpeedyUnqualified,
        rankPub: PlayerRecordUpdateStrictFields.rankPub,
        speedy: PlayerRecordUpdateStrictFields.speedy,
    }),
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

import { Prisma } from 'prisma/generated/client';
import {
    GameInvitationCreateInputObjectZodSchema,
    GameInvitationCreateManyInputObjectZodSchema,
    GameInvitationCreateOneZodSchema,
    GameInvitationUncheckedCreateInputObjectZodSchema,
    GameInvitationUncheckedUpdateInputObjectZodSchema,
    GameInvitationUpdateInputObjectZodSchema,
    GameInvitationUpdateOneZodSchema,
    GameInvitationUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const GAME_INVITATION_UUID_LENGTH = 36;

const GameInvitationCreateStrictFields = {
    uuid: z.string().length(GAME_INVITATION_UUID_LENGTH),
    playerId: z.number().int().min(1),
    gameDayId: z.number().int().min(1),
};

const GameInvitationUpdateStrictFields = {
    uuid: z.string().length(GAME_INVITATION_UUID_LENGTH).optional(),
    playerId: z.number().int().min(1).optional(),
    gameDayId: z.number().int().min(1).optional(),
};

export const GameInvitationWriteInputSchema = z.object({
    ...GameInvitationCreateStrictFields,
}).strip();

export type GameInvitationWriteInput = z.infer<typeof GameInvitationWriteInputSchema>;

export const GameInvitationCreateManyWriteInputSchema = z.array(GameInvitationWriteInputSchema);

export type GameInvitationCreateManyWriteInput = z.infer<typeof GameInvitationCreateManyWriteInputSchema>;

const GameInvitationCreateDataStrictSchema = z.union([
    GameInvitationCreateInputObjectZodSchema.extend(GameInvitationCreateStrictFields),
    GameInvitationUncheckedCreateInputObjectZodSchema.extend(GameInvitationCreateStrictFields),
]);

const GameInvitationCreateOneStrictZodSchema = GameInvitationCreateOneZodSchema.extend({
    data: GameInvitationCreateDataStrictSchema,
});

export const GameInvitationCreateOneStrictSchema: z.ZodType<Prisma.GameInvitationCreateArgs> =
    GameInvitationCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.GameInvitationCreateArgs>;

const GameInvitationCreateManyStrictZodSchema = z.object({
    data: z.union([
        GameInvitationCreateManyInputObjectZodSchema.extend(GameInvitationCreateStrictFields),
        z.array(GameInvitationCreateManyInputObjectZodSchema.extend(GameInvitationCreateStrictFields)),
    ]),
}).strict();

export const GameInvitationCreateManyStrictSchema: z.ZodType<Prisma.GameInvitationCreateManyArgs> =
    GameInvitationCreateManyStrictZodSchema as unknown as z.ZodType<Prisma.GameInvitationCreateManyArgs>;

const GameInvitationUpdateDataStrictSchema = z.union([
    GameInvitationUpdateInputObjectZodSchema.extend(GameInvitationUpdateStrictFields),
    GameInvitationUncheckedUpdateInputObjectZodSchema.extend(GameInvitationUpdateStrictFields),
]);

const GameInvitationUpdateOneStrictZodSchema = GameInvitationUpdateOneZodSchema.extend({
    data: GameInvitationUpdateDataStrictSchema,
});

export const GameInvitationUpdateOneStrictSchema: z.ZodType<Prisma.GameInvitationUpdateArgs> =
    GameInvitationUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.GameInvitationUpdateArgs>;

const GameInvitationUpsertOneStrictZodSchema = GameInvitationUpsertOneZodSchema.extend({
    create: GameInvitationCreateDataStrictSchema,
    update: GameInvitationUpdateDataStrictSchema,
});

export const GameInvitationUpsertOneStrictSchema: z.ZodType<Prisma.GameInvitationUpsertArgs> =
    GameInvitationUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.GameInvitationUpsertArgs>;

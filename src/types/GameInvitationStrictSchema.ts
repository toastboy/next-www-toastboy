import { Prisma } from 'prisma/generated/client';
import {
    GameInvitationCreateInputObjectZodSchema,
    GameInvitationCreateManyInputObjectZodSchema,
    GameInvitationCreateOneZodSchema,
    GameInvitationUncheckedCreateInputObjectZodSchema,
    GameInvitationUncheckedUpdateInputObjectZodSchema,
    GameInvitationUpdateInputObjectZodSchema,
    GameInvitationUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const GAME_INVITATION_UUID_LENGTH = 36;

const GameInvitationStrictFields = {
    uuid: z.string().length(GAME_INVITATION_UUID_LENGTH),
};

const GameInvitationStrictIds = {
    playerId: z.number().int().min(1),
    gameDayId: z.number().int().min(1),
};

const GameInvitationCreateStrictFields = {
    ...GameInvitationStrictFields,
    ...GameInvitationStrictIds,
};

const GameInvitationUpdateStrictFields = {
    uuid: GameInvitationStrictFields.uuid.optional(),
    playerId: GameInvitationStrictIds.playerId.optional(),
    gameDayId: GameInvitationStrictIds.gameDayId.optional(),
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
    GameInvitationCreateManyStrictZodSchema;

const GameInvitationUpdateDataStrictSchema = z.union([
    GameInvitationUpdateInputObjectZodSchema.extend(GameInvitationUpdateStrictFields),
    GameInvitationUncheckedUpdateInputObjectZodSchema.extend(GameInvitationUpdateStrictFields),
]);

const GameInvitationUpsertOneStrictZodSchema = GameInvitationUpsertOneZodSchema.extend({
    create: GameInvitationCreateDataStrictSchema,
    update: GameInvitationUpdateDataStrictSchema,
});

export const GameInvitationUpsertOneStrictSchema: z.ZodType<Prisma.GameInvitationUpsertArgs> =
    GameInvitationUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.GameInvitationUpsertArgs>;

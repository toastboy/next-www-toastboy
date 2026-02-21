import z from 'zod';

export const BalanceSchema = z.object({
    playerId: z.number().int().min(1).nullable(),
    maxGameDayId: z.number().int().min(1).optional(),
    playerName: z.string().min(1),
    amount: z.number().int(),
});

export type BalanceType = z.infer<typeof BalanceSchema>;

export const PlayerBalanceSchema = BalanceSchema.extend({
    playerId: z.number().int().min(1),
});

export type PlayerBalanceType = z.infer<typeof PlayerBalanceSchema>;

export const ClubBalanceSchema = BalanceSchema.extend({
    playerId: z.null(),
});

export type ClubBalanceType = z.infer<typeof ClubBalanceSchema>;

export const BalanceSummarySchema = z.object({
    players: z.array(PlayerBalanceSchema),
    club: ClubBalanceSchema,
    total: z.number().int(),
    positiveTotal: z.number().int().nonnegative(),
    negativeTotal: z.number().int().nonpositive(),
});

export type BalanceSummaryType = z.infer<typeof BalanceSummarySchema>;

import z from 'zod';

export interface MoneyChartDatum {
    interval: string;
    credits: number;
    debits: number;
}

export const BalanceSchema = z.object({
    playerId: z.number().int().min(1).nullable(),
    maxGameDayId: z.number().int().min(1),
    playerName: z.string().min(1),
    amount: z.number().int(),
});

export type BalanceType = z.infer<typeof BalanceSchema>;

export const PlayerBalanceSchema = BalanceSchema.extend({
    playerId: z.number().int().min(1),
});

export type PlayerBalanceType = z.infer<typeof PlayerBalanceSchema>;

export const BalanceSummarySchema = z.object({
    players: z.array(PlayerBalanceSchema),
    total: z.number().int(),
    positiveTotal: z.number().int().nonnegative(),
    negativeTotal: z.number().int().nonpositive(),
});

export type BalanceSummaryType = z.infer<typeof BalanceSummarySchema>;

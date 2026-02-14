import z from 'zod';

export const DebtSchema = z.object({
    playerId: z.number().int().min(1),
    playerName: z.string().min(1),
    amount: z.number().nonnegative(),
});

export type DebtType = z.infer<typeof DebtSchema>;

export const DebtSummarySchema = z.object({
    current: z.array(DebtSchema),
    historic: z.array(DebtSchema),
    total: z.number().nonnegative(),
});

export type DebtSummaryType = z.infer<typeof DebtSummarySchema>;

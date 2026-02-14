import z from 'zod';

export const PayDebtInputSchema = z.object({
    playerId: z.number().int().min(1),
    amount: z.number().positive(),
});

export type PayDebtInput = z.infer<typeof PayDebtInputSchema>;

export const PayDebtResultSchema = z.object({
    playerId: z.number().int().min(1),
    gamesMarkedPaid: z.number().int().nonnegative(),
    requestedAmount: z.number().nonnegative(),
    appliedAmount: z.number().nonnegative(),
    remainingAmount: z.number().nonnegative(),
});

export type PayDebtResult = z.infer<typeof PayDebtResultSchema>;

export type PayDebtProxy = (data: PayDebtInput) => Promise<PayDebtResult>;

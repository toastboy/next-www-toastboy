import z from 'zod';

export const PayDebtInputSchema = z.object({
    playerId: z.number().int().min(1),
    amount: z.number().positive(),
});

export type PayDebtInput = z.infer<typeof PayDebtInputSchema>;

export const PayDebtResultSchema = z.object({
    playerId: z.number().int().min(1),
    transactionId: z.number().int().min(1),
    amount: z.number().positive(),
    resultingBalance: z.number(),
});

export type PayDebtResult = z.infer<typeof PayDebtResultSchema>;

export type PayDebtProxy = (data: PayDebtInput) => Promise<PayDebtResult>;

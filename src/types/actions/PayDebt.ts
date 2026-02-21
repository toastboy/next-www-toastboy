import z from 'zod';

export const PayDebtInputSchema = z.object({
    playerId: z.number().int().min(1),
    amount: z.number().int().positive(),
});

export type PayDebtInput = z.infer<typeof PayDebtInputSchema>;

export const PayDebtResultSchema = z.object({
    playerId: z.number().int().min(1),
    transactionId: z.number().int().min(1),
    amount: z.number().int().positive(),
    resultingBalance: z.number().int(),
});

export type PayDebtResult = z.infer<typeof PayDebtResultSchema>;

export type PayDebtProxy = (data: PayDebtInput) => Promise<PayDebtResult>;

import z from 'zod';

/**
 * Input schema for a debt payment operation targeting multiple game days.
 *
 * Creates one transaction for each gameDayId in the array, effectively
 * settling unpaid charges across multiple games for a single player.
 */
export const PayDebtInputSchema = z.object({
    playerId: z.number().int().min(1),
    amount: z.number().int().positive(),
    gameDayIds: z.array(z.number().int().min(1)).min(1),
});

export type PayDebtInput = z.infer<typeof PayDebtInputSchema>;

/**
 * Result of a successful debt payment operation.
 *
 * Contains the created transaction IDs, the total amount paid, and the
 * resulting player balance after all transactions.
 */
export const PayDebtResultSchema = z.object({
    playerId: z.number().int().min(1),
    transactionIds: z.array(z.number().int().min(1)).min(1),
    amount: z.number().int().positive(),
    resultingBalance: z.number().int(),
});

export type PayDebtResult = z.infer<typeof PayDebtResultSchema>;

export type PayDebtProxy = (data: PayDebtInput) => Promise<PayDebtResult>;

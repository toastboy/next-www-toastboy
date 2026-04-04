import z from 'zod';

export interface MoneyChartDatum {
    interval: string;
    credits: number;
    debits: number;
}

/**
 * Represents a single unpaid game charge for a player.
 *
 * Each debt corresponds to a PlayerGameCharge transaction with a specific
 * gameDayId and amount.
 */
export const PlayerDebtSchema = z.object({
    gameDayId: z.number().int().min(1),
    amount: z.number().int().positive(),
});

export type PlayerDebtType = z.infer<typeof PlayerDebtSchema>;

/**
 * Represents all unpaid charges for a single player.
 *
 * Contains the player's ID and name, along with a list of individual unpaid
 * game charges (debts) each with its own gameDayId and amount.
 */
export const PlayerDebtsSchema = z.object({
    playerId: z.number().int().min(1),
    playerName: z.string().min(1),
    debts: z.array(PlayerDebtSchema),
});

export type PlayerDebtsType = z.infer<typeof PlayerDebtsSchema>;

/**
 * Summary of all player debts and club balance totals.
 *
 * Contains a list of players with their unpaid charges.
 */
export const DebtsSummarySchema = z.object({
    players: z.array(PlayerDebtsSchema),
});

export type DebtsSummaryType = z.infer<typeof DebtsSummarySchema>;

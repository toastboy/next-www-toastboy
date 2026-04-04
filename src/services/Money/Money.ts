import prisma from 'prisma/prisma';
import z from 'zod';

import { normalizeUnknownError } from '@/lib/errors';
import { toPounds } from '@/lib/money';
import gameDayService from '@/services/GameDay';
import { type PayDebtResult, PayDebtResultSchema } from '@/types/actions/PayDebt';
import { RecordHallHireInputSchema } from '@/types/actions/RecordHallHire';
import type { MoneyChartDatum, PlayerDebtsType } from '@/types/DebtType';
import { DebtsSummarySchema } from '@/types/DebtType';

/**
 * Formats dates to their abbreviated month name using British English locale
 * rules.
 *
 * Produces 3-letter month labels such as `Jan`, `Feb`, and `Mar` when used via
 * `formatMonth.format(date)`.
 */
const formatMonth = new Intl.DateTimeFormat('en-GB', {
    // TODO: This should live in a shared utils file if we need to format months
    // in multiple places, but really this logic belongs in the presentation
    // layer and the service should just return raw data.
    month: 'short',
});

class MoneyService {
    /**
     * Returns all unpaid player game charges grouped by player.
     *
     * Each player is represented with their ID, name, and a list of unpaid
     * PlayerGameCharge transactions. Each unpaid charge includes the gameDayId
     * and amount owed for that specific game.
     *
     * @returns A promise that resolves to a DebtsSummaryType containing players
     * with their respective unpaid game charges and aggregate balance information
     */
    async getDebts() {
        try {
            // Fetch all player game charges first, then remove ones that have
            // already been paid with a matching PlayerPayment.
            const playerGameCharges = await prisma.transaction.findMany({
                where: {
                    type: 'PlayerGameCharge',
                    playerId: {
                        not: null,
                    },
                    gameDayId: {
                        not: null,
                    },
                },
                select: {
                    playerId: true,
                    gameDayId: true,
                    amountPence: true,
                },
            });

            const playerPayments = await prisma.transaction.findMany({
                where: {
                    type: 'PlayerPayment',
                    playerId: {
                        not: null,
                    },
                    gameDayId: {
                        not: null,
                    },
                },
                select: {
                    playerId: true,
                    gameDayId: true,
                },
            });

            const paidChargeKeys = new Set(
                playerPayments
                    .filter((payment) => payment.playerId != null && payment.gameDayId != null)
                    .map((payment) => `${payment.playerId ?? ''}:${payment.gameDayId ?? ''}`),
            );

            const unpaidCharges = playerGameCharges.filter((charge) => {
                if (charge.playerId == null || charge.gameDayId == null) {
                    return false;
                }

                return !paidChargeKeys.has(`${charge.playerId}:${charge.gameDayId}`);
            });

            // Group debts (unpaid charges) by playerId
            const debtsByPlayer = new Map<number, { charges: { gameDayId: number | null; amount: number }[]; playerId: number }>();

            for (const charge of unpaidCharges) {
                if (charge.playerId == null || charge.gameDayId == null) {
                    continue;
                }

                const key = charge.playerId;
                if (!debtsByPlayer.has(key)) {
                    debtsByPlayer.set(key, {
                        charges: [],
                        playerId: charge.playerId,
                    });
                }

                const entry = debtsByPlayer.get(key)!;
                entry.charges.push({
                    gameDayId: charge.gameDayId,
                    amount: charge.amountPence,
                });
            }

            // Build the players array with debts
            const players: PlayerDebtsType[] = [];
            for (const [, { charges, playerId }] of debtsByPlayer) {
                players.push({
                    playerId,
                    playerName: `Player ${playerId}`,
                    debts: charges.map((charge) => ({
                        gameDayId: charge.gameDayId!,
                        amount: charge.amount,
                    })),
                });
            }

            return DebtsSummarySchema.parse({
                players,
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Returns chart data grouped by month (when year > 0) or by year (when year
     * === 0 for all-time). Credits are transactions with negative amountPence
     * (money flowing in); debits are those with positive amountPence (money
     * flowing out).
     *
     * @param year - The year to filter transactions by (0 for all-time data)
     * @returns An array of chart data points with credits and debits grouped by
     * interval
     */
    async getChartData(year: number): Promise<MoneyChartDatum[]> {
        try {
            const { minId, maxId } = await gameDayService.getIdRangeForYear(year);
            if (minId === null || maxId === null) {
                return [];
            }

            const playerPayments = await prisma.transaction.groupBy({
                by: ['gameDayId'],
                where: {
                    type: 'PlayerPayment',
                    gameDayId: {
                        gte: minId,
                        lte: maxId,
                    },
                },
                _sum: {
                    amountPence: true,
                },
            });
            const hallHire = await prisma.transaction.groupBy({
                by: ['gameDayId'],
                where: {
                    type: 'HallHire',
                    gameDayId: {
                        gte: minId,
                        lte: maxId,
                    },
                },
                _sum: {
                    amountPence: true,
                },
            });

            const gameDays = await prisma.gameDay.findMany({
                where: {
                    id: {
                        gte: minId,
                        lte: maxId,
                    },
                },
                select: {
                    id: true,
                    date: true,
                },
            });

            /**
             * Aggregates transaction sums into interval totals by incrementing
             * the `credits` and `debits` value for each matching interval.
             *
             * For each transaction:
             * - skips rows with a `null` `gameDayId`
             * - skips rows whose `gameDayId` has no mapped interval
             * - converts `_sum.amountPence` to pounds (treating `null` as `0`)
             *   and adds it to the interval's `debits`
             *
             * This function mutates `totalsByInterval` in place, creating a
             * default `{ credits: 0, debits: 0 }` entry for an interval when
             * one does not already exist.
             *
             * @param transactions - Aggregated transaction rows keyed by
             * `gameDayId` with summed amounts in pence.
             * @param intervalByGameDayId - Lookup map from `gameDayId` to
             * interval key.
             * @param totalsByInterval - Mutable map of interval totals to
             * update.
             */
            const accumulateTotals = (
                transactions: { gameDayId: number | null; _sum: { amountPence: number | null } }[],
                intervalByGameDayId: Map<number, number>,
                totalsByInterval: Map<number, { credits: number; debits: number }>,
            ) => {
                for (const row of transactions) {
                    if (row.gameDayId == null) {
                        continue;
                    }

                    const interval = intervalByGameDayId.get(row.gameDayId);
                    if (interval == null) {
                        continue;
                    }

                    const entry = totalsByInterval.get(interval) ?? { credits: 0, debits: 0 };
                    const amountPence = row._sum.amountPence ?? 0;
                    if (amountPence > 0) {
                        entry.debits += toPounds(amountPence);
                    } else {
                        entry.credits += toPounds(Math.abs(amountPence));
                    }
                    totalsByInterval.set(interval, entry);
                }
            };

            if (year > 0) {
                const monthByGameDayId = new Map<number, number>(
                    gameDays.map((gameDay): [number, number] => [
                        gameDay.id,
                        gameDay.date.getUTCMonth(),
                    ]),
                );
                const totalsByMonth = new Map<number, { credits: number; debits: number }>();

                accumulateTotals(playerPayments, monthByGameDayId, totalsByMonth);
                accumulateTotals(hallHire, monthByGameDayId, totalsByMonth);

                return [...totalsByMonth.entries()]
                    .sort(([a], [b]) => a - b)
                    .map(([month, totals]) => ({
                        interval: formatMonth.format(new Date(0, month)),
                        credits: totals.credits,
                        debits: totals.debits,
                    }));
            } else {
                const yearByGameDayId = new Map<number, number>(
                    gameDays.map((gameDay): [number, number] => [
                        gameDay.id,
                        gameDay.date.getUTCFullYear(),
                    ]),
                );
                const totalsByYear = new Map<number, { credits: number; debits: number }>();

                accumulateTotals(playerPayments, yearByGameDayId, totalsByYear);
                accumulateTotals(hallHire, yearByGameDayId, totalsByYear);

                return [...totalsByYear.entries()]
                    .sort(([a], [b]) => a - b)
                    .map(([year, totals]) => ({
                        interval: String(year),
                        credits: totals.credits,
                        debits: totals.debits,
                    }));
            }
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Charges a player for a game by creating a transaction record.
     *
     * Validates inputs and persists the amount with the provided note.
     *
     * @param playerId - The unique identifier of the player to charge.
     * @param amount - The amount to charge.
     * @param note - A short description for the charge (max 255 characters).
     * @throws Will rethrow any validation or persistence errors encountered.
     */
    async charge(
        playerId: number,
        gameDayId: number,
        amount: number,
        note?: string,
    ): Promise<void> {
        try {
            const parsed = z.object({
                playerId: z.number().int().min(1),
                gameDayId: z.number().int().min(1),
                amount: z.number().int().positive(),
                note: z.string().max(255).optional(),
            }).parse({ playerId, gameDayId, amount, note });

            await prisma.transaction.upsert({
                where: {
                    type_playerId_gameDayId: {
                        type: 'PlayerGameCharge',
                        playerId: parsed.playerId,
                        gameDayId: parsed.gameDayId,
                    },
                },
                update: {
                    amountPence: parsed.amount,
                    note: parsed.note,
                },
                create: {
                    type: 'PlayerGameCharge',
                    amountPence: parsed.amount,
                    playerId: parsed.playerId,
                    gameDayId: parsed.gameDayId,
                    note: parsed.note,
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Records a hall hire (invoice) payment as a club-level transaction.
     *
      * A HallHire transaction has no playerId. The amount is
     * stored as a positive value so that the club balance (which is the
     * negation of the sum) becomes negative, representing money paid out.
     *
     * @param amountPence - The invoice amount in pence (must be positive).
     * @param gameDayId - The unique identifier of the game day associated with the hall hire.
     * @param note - An optional description for the transaction (max 255 chars).
     * @throws Will rethrow any validation or persistence errors encountered.
     */
    async recordHallHire(
        amountPence: number,
        gameDayId: number,
        note?: string,
    ): Promise<void> {
        try {
            const parsed = RecordHallHireInputSchema.parse({ amountPence, gameDayId, note });

            const updateResult = await prisma.transaction.updateMany({
                where: {
                    type: 'HallHire',
                    playerId: null,
                    gameDayId: parsed.gameDayId,
                },
                data: {
                    amountPence: parsed.amountPence,
                    note: parsed.note,
                },
            });

            if (updateResult.count === 0) {
                await prisma.transaction.create({
                    data: {
                        type: 'HallHire',
                        amountPence: parsed.amountPence,
                        playerId: null,
                        gameDayId: parsed.gameDayId,
                        note: parsed.note,
                    },
                });
            }
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Records a manual payment from a player, reducing their debt balance.
     *
     * Creates a single payment transaction for the given gameDayId.
     * This is a legacy method; new code should use payMultiple() instead.
     *
     * @param playerId - The unique identifier of the player making the payment
     * (must be >= 1)
     * @param amount - The payment amount in pence (must be positive)
     * @param gameDayId - Game day identifier to associate with the payment
     *
     * @returns A promise that resolves to a PayDebtResult containing:
     *   - transactionIds: Array containing the ID of the created transaction
     *   - amount: The payment amount that was processed
     *   - resultingBalance: The player's balance after the payment
     *   - playerId: The player's ID
     *
     * @throws {Error} If validation fails or the database transaction
     * encounters an error
     *
     * @deprecated Use payMultiple() instead for new code
     */
    async pay(playerId: number, amount: number, gameDayId: number): Promise<PayDebtResult> {
        try {
            const parsed = z.object({
                playerId: z.number().int().min(1),
                amount: z.number().int().positive(),
                gameDayId: z.number().int().min(1).optional(),
            }).parse({ playerId, amount, gameDayId });

            const paymentResult = await prisma.$transaction(async (tx) => {
                const created = await tx.transaction.create({
                    data: {
                        type: 'PlayerPayment',
                        amountPence: -parsed.amount,
                        playerId: parsed.playerId,
                        gameDayId: parsed.gameDayId,
                        note: 'Manual payment',
                    },
                    select: {
                        id: true,
                    },
                });

                const aggregate = await tx.transaction.aggregate({
                    where: {
                        playerId: parsed.playerId,
                    },
                    _sum: {
                        amountPence: true,
                    },
                });

                return {
                    transactionIds: [created.id],
                    resultingBalance: aggregate._sum.amountPence ?? 0,
                };
            });

            const resultingBalance = -paymentResult.resultingBalance;

            return PayDebtResultSchema.parse({
                playerId: parsed.playerId,
                transactionIds: paymentResult.transactionIds,
                amount: parsed.amount,
                resultingBalance,
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Records manual payments from a player across multiple game days.
     *
     * Creates one payment transaction for each gameDayId, each with an equal
     * share of the total amount. This method distributes a single payment across
     * multiple unpaid charges.
     *
     * @param playerId - The unique identifier of the player making the payment
     * (must be >= 1)
     * @param amount - The total payment amount in pence (must be positive)
     * @param gameDayIds - Array of game day identifiers to associate payments with
     * (must have at least one entry)
     *
     * @returns A promise that resolves to a PayDebtResult containing:
     *   - transactionIds: Array of IDs of the created transaction records
     *   - amount: The total payment amount that was processed
     *   - resultingBalance: The player's balance after all payments
     *   - playerId: The player's ID
     *
     * @throws {Error} If validation fails or the database transaction
     * encounters an error
     *
     * @example
     * const result = await moneyService.payMultiple(123, 5000, [1, 2, 3]);
     * // Creates 3 payment transactions, each for ~1667 pence
     * // result.resultingBalance contains the updated balance in pence
     */
    async payMultiple(
        playerId: number,
        amount: number,
        gameDayIds: number[],
    ): Promise<PayDebtResult> {
        try {
            const parsed = z.object({
                playerId: z.number().int().min(1),
                amount: z.number().int().positive(),
                gameDayIds: z.array(z.number().int().min(1)).min(1),
            }).parse({ playerId, amount, gameDayIds });

            const paymentResult = await prisma.$transaction(async (tx) => {
                const transactionIds: number[] = [];

                // Distribute payment evenly across all gameDayIds
                const amountPerDay = Math.floor(parsed.amount / parsed.gameDayIds.length);
                const remainder = parsed.amount % parsed.gameDayIds.length;

                for (let i = 0; i < parsed.gameDayIds.length; i++) {
                    const paymentAmount = amountPerDay + (i === 0 ? remainder : 0);

                    const created = await tx.transaction.create({
                        data: {
                            type: 'PlayerPayment',
                            amountPence: -paymentAmount,
                            playerId: parsed.playerId,
                            gameDayId: parsed.gameDayIds[i],
                            note: 'Manual payment',
                        },
                        select: {
                            id: true,
                        },
                    });

                    transactionIds.push(created.id);
                }

                const aggregate = await tx.transaction.aggregate({
                    where: {
                        playerId: parsed.playerId,
                    },
                    _sum: {
                        amountPence: true,
                    },
                });

                return {
                    transactionIds,
                    resultingBalance: aggregate._sum.amountPence ?? 0,
                };
            });

            const resultingBalance = -paymentResult.resultingBalance;

            return PayDebtResultSchema.parse({
                playerId: parsed.playerId,
                transactionIds: paymentResult.transactionIds,
                amount: parsed.amount,
                resultingBalance,
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const moneyService = new MoneyService();
export default moneyService;

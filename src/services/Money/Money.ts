import prisma from 'prisma/prisma';
import z from 'zod';

import { normalizeUnknownError } from '@/lib/errors';
import { toPounds } from '@/lib/money';
import { type PayDebtResult, PayDebtResultSchema } from '@/types/actions/PayDebt';
import { RecordHallHireInputSchema } from '@/types/actions/RecordHallHire';
import type { MoneyChartDatum, PlayerBalanceType } from '@/types/DebtType';
import { BalanceSummarySchema } from '@/types/DebtType';

import gameDayService from '../GameDay';


/**
 * Compares two player balance objects by player name and then by player ID.
 *
 * @param a - The first player balance object to compare
 * @param b - The second player balance object to compare
 * @returns A negative number if `a` should come before `b`, a positive number
 *          if `a` should come after `b`, or 0 if they are equal. The comparison
 *          is first done by player name (alphabetically), then by player ID
 *          (numerically). Players with null IDs are sorted after players with
 *          valid IDs.
 */
const comparePlayerName = (a: PlayerBalanceType, b: PlayerBalanceType) => {
    const nameComparison = a.playerName.localeCompare(b.playerName);
    if (nameComparison !== 0) return nameComparison;

    // Ensure stable ordering when playerId can be null (e.g. club balance).
    if (a.playerId == null && b.playerId == null) return 0;
    if (a.playerId == null) return 1;
    if (b.playerId == null) return -1;
    return a.playerId - b.playerId;
};

/**
 * Gets the display name for a player.
 *
 * Returns "Player {id}" if the player is anonymous or has no name. Otherwise
 * returns the trimmed player name.
 *
 * @param player - The player object containing id, name, and anonymous flag
 * @param player.id - The unique identifier of the player
 * @param player.name - The player's name (nullable)
 * @param player.anonymous - Whether the player should be displayed anonymously
 * (nullable)
 * @returns The display name for the player
 */
const getPlayerName = (player: { id: number; name: string | null; anonymous: boolean | null }) => {
    // TODO: This logic is duplicated from the one in the PlayerName component.
    // Consider centralizing it.
    if (player.anonymous) {
        return `Player ${player.id}`;
    }

    const trimmedName = player.name?.trim();
    if (trimmedName) {
        return trimmedName;
    }

    return `Player ${player.id}`;
};

/**
 * Formats dates to their abbreviated month name using British English locale
 * rules.
 *
 * Produces 3-letter month labels such as `Jan`, `Feb`, and `Mar` when used via
 * `formatMonth.format(date)`.
 */
const formatMonth = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
});

class MoneyService {
    /**
     * Returns signed balances grouped by player, with `playerId: null`
     * representing the club's own ledger balance. Negative balances are debts.
     */
    async getBalances() {
        try {
            const groupedBalances = await prisma.transaction.groupBy({
                by: ['playerId'],
                _sum: {
                    amountPence: true,
                },
                _max: {
                    gameDayId: true,
                },
            });

            const playerIds = groupedBalances
                .map((row) => row.playerId)
                .filter((playerId): playerId is number => playerId !== null);

            const players = playerIds.length > 0 ?
                await prisma.player.findMany({
                    where: {
                        id: {
                            in: playerIds,
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                        anonymous: true,
                    },
                }) :
                [];

            const playersById = new Map(players.map((player) => [player.id, player]));

            let clubBalance = 0;
            const playerBalances: PlayerBalanceType[] = [];

            for (const row of groupedBalances) {
                const amount = -(row._sum.amountPence ?? 0);

                if (row.playerId === null) {
                    clubBalance += amount;
                    continue;
                }

                const player = playersById.get(row.playerId) ?? {
                    id: row.playerId,
                    name: null,
                    anonymous: false,
                };

                playerBalances.push({
                    playerId: row.playerId,
                    maxGameDayId: row._max.gameDayId ?? undefined,
                    playerName: getPlayerName(player),
                    amount,
                });
            }

            playerBalances.sort(comparePlayerName);

            const total = groupedBalances.reduce((acc, row) => acc - (row._sum.amountPence ?? 0), 0);
            const positiveTotal = groupedBalances.reduce((acc, row) => {
                const amount = -(row._sum.amountPence ?? 0);
                return amount > 0 ? acc + amount : acc;
            }, 0);
            const negativeTotal = groupedBalances.reduce((acc, row) => {
                const amount = -(row._sum.amountPence ?? 0);
                return amount < 0 ? acc + amount : acc;
            }, 0);

            // Note: The Money page currently reads only a subset of this summary,
            // but this service intentionally returns the full BalanceSummarySchema
            // shape so that callers can evolve without changing this contract.
            return BalanceSummarySchema.parse({
                players: playerBalances,
                club: {
                    playerId: null,
                    playerName: 'Club',
                    amount: clubBalance,
                },
                total,
                positiveTotal,
                negativeTotal,
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
     * Records a player payment as a signed transaction in the ledger.
     */
    async pay(playerId: number, amount: number): Promise<PayDebtResult> {
        try {
            const parsed = z.object({
                playerId: z.number().int().min(1),
                amount: z.number().int().positive(),
            }).parse({ playerId, amount });

            const paymentResult = await prisma.$transaction(async (tx) => {
                const created = await tx.transaction.create({
                    data: {
                        type: 'PlayerPayment',
                        amountPence: -parsed.amount,
                        playerId: parsed.playerId,
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
                    transactionId: created.id,
                    resultingBalance: aggregate._sum.amountPence ?? 0,
                };
            });

            const resultingBalance = -paymentResult.resultingBalance;

            return PayDebtResultSchema.parse({
                playerId: parsed.playerId,
                transactionId: paymentResult.transactionId,
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

import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import z from 'zod';

import gameDayService from '@/services/GameDay';
import { type PayDebtResult, PayDebtResultSchema } from '@/types/actions/PayDebt';
import type { DebtType } from '@/types/DebtType';
import { DebtSummarySchema } from '@/types/DebtType';

const log = debug('footy:api');

const LEGACY_MIN_DEBT_GAME_DAY_ID = 150;

// Keep money math in integer pence to avoid floating-point precision issues.
const toPence = (amount: number) => Math.round(amount * 100);
const fromPence = (amount: number) => Number((amount / 100).toFixed(2));

const comparePlayerName = (a: DebtType, b: DebtType) => {
    const nameComparison = a.playerName.localeCompare(b.playerName);
    if (nameComparison !== 0) return nameComparison;
    return a.playerId - b.playerId;
};

const getPlayerName = (player: { id: number; name: string | null; anonymous: boolean | null }) => {
    if (player.anonymous) {
        return `Player ${player.id}`;
    }

    const trimmedName = player.name?.trim();
    if (trimmedName) {
        return trimmedName;
    }

    return `Player ${player.id}`;
};

class MoneyService {
    /**
     * Retrieves the cost of a game based on its game day ID.
     *
     * The cost is determined by predefined price tiers based on historical game
     * day IDs. This logic is currently hardcoded and should ideally be moved to
     * a database column for better maintainability.
     *
     * @param gameDayId - The game day ID (must be a positive integer)
     * @returns The cost of the game as a number
     * @throws {ZodError} If gameDayId is not a valid positive integer
     *
     * @remarks
     * Cost tiers are based on game day ID ranges:
     * - IDs 1-178: $2.50
     * - IDs 179-335: $3.00
     * - IDs 336-700: $3.50
     * - IDs 701-909: $4.00
     * - IDs 910-1087: $4.50
     * - IDs 1088+: $5.00
     */
    getGameCost(gameDayId: number): number {
        const id = z.number().int().min(1).parse(gameDayId);

        // TODO: Almost certainly I should add a "cost" column to the game day
        // table and backfill it, rather than hardcoding this logic in code. But
        // for now, this matches the existing logic and allows us to move
        // forward with the new money page without a DB migration. Really the
        // time to consider this is in the new game form: I should add a cost
        // per game when the annual renewal happens given that this is when KK
        // set the hall cost.
        if (id < 179) return 2.5;
        if (id < 336) return 3.0;
        if (id < 701) return 3.5;
        if (id < 910) return 4.0;
        if (id < 1088) return 4.5;

        return 5.0;
    }

    /**
     * Retrieves a summary of all outstanding debts owed by players.
     *
     * Fetches all unpaid outcomes from the legacy debt threshold onwards and
     * categorizes debts into current participants (still playing in the latest
     * game) and historic debts. Aggregates multiple unpaid outcomes per player
     * into a single debt amount.
     *
     * @returns {Promise<DebtSummarySchema>} A parsed debt summary containing:
     *   - `current`: Array of debts from active participants, sorted by player
     *     name
     *   - `historic`: Array of debts from inactive participants, sorted by
     *     player name
     *   - `total`: The sum of all outstanding debts in pounds
     *
     * @throws {Error} Logs and rethrows any errors encountered during the
     * database queries
     */
    async getDebts() {
        try {
            const currentGame = await gameDayService.getCurrent();

            const [unpaidOutcomes, currentParticipants] = await Promise.all([
                prisma.outcome.findMany({
                    where: {
                        paid: null,
                        points: {
                            not: null,
                        },
                        team: {
                            not: null,
                        },
                        gameDayId: {
                            gte: LEGACY_MIN_DEBT_GAME_DAY_ID,
                        },
                    },
                    select: {
                        playerId: true,
                        gameDayId: true,
                        player: {
                            select: {
                                id: true,
                                name: true,
                                anonymous: true,
                            },
                        },
                    },
                }),
                currentGame ?
                    prisma.outcome.findMany({
                        where: {
                            gameDayId: currentGame.id,
                            team: {
                                not: null,
                            },
                        },
                        select: {
                            playerId: true,
                        },
                        distinct: ['playerId'],
                    }) :
                    Promise.resolve([]),
            ]);

            const currentParticipantIds = new Set(currentParticipants.map((row) => row.playerId));

            const debtByPlayerId = new Map<number, DebtType>();
            for (const outcome of unpaidOutcomes) {
                const playerName = getPlayerName(outcome.player);
                const existing = debtByPlayerId.get(outcome.playerId);
                const additionalDebt = this.getGameCost(outcome.gameDayId);

                if (!existing) {
                    debtByPlayerId.set(outcome.playerId, {
                        playerId: outcome.playerId,
                        playerName,
                        amount: additionalDebt,
                    });
                    continue;
                }

                existing.amount = fromPence(toPence(existing.amount) + toPence(additionalDebt));
            }

            const allDebts = Array.from(debtByPlayerId.values()).sort(comparePlayerName);
            const current = allDebts.filter((row) => currentParticipantIds.has(row.playerId));
            const historic = allDebts.filter((row) => !currentParticipantIds.has(row.playerId));

            const totalPence = allDebts.reduce((acc, row) => acc + toPence(row.amount), 0);

            return DebtSummarySchema.parse({
                current,
                historic,
                total: fromPence(totalPence),
            });
        } catch (error) {
            log(`Error fetching money debts: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Applies a player payment toward outstanding unpaid game outcomes, marking
     * eligible games as paid in chronological order until the amount is
     * exhausted.
     *
     * Validates input, converts amounts to pence, and performs updates in a
     * transaction. Returns the number of games marked paid and the
     * applied/remaining amounts.
     *
     * @param playerId - The numeric identifier of the player making the
     * payment.
     * @param amount - The payment amount to apply.
     * @returns A {@link PayDebtResult} describing the payment outcome.
     * @throws If validation fails or a database operation errors.
     */
    async pay(playerId: number, amount: number): Promise<PayDebtResult> {
        try {
            const parsed = z.object({
                playerId: z.number().int().min(1),
                amount: z.number().positive(),
            }).parse({ playerId, amount });

            const requestedAmountPence = toPence(parsed.amount);

            const paymentResult = await prisma.$transaction(async (tx) => {
                const outcomes = await tx.outcome.findMany({
                    where: {
                        playerId: parsed.playerId,
                        paid: null,
                        points: {
                            not: null,
                        },
                        team: {
                            not: null,
                        },
                        gameDayId: {
                            gte: LEGACY_MIN_DEBT_GAME_DAY_ID,
                        },
                    },
                    select: {
                        id: true,
                        gameDayId: true,
                    },
                    orderBy: [
                        {
                            gameDayId: 'asc',
                        },
                        {
                            id: 'asc',
                        },
                    ],
                });

                let remainingAmountPence = requestedAmountPence;
                let gamesMarkedPaid = 0;

                for (const outcome of outcomes) {
                    const gameCostPence = toPence(this.getGameCost(outcome.gameDayId));
                    if (gameCostPence > remainingAmountPence) {
                        break;
                    }

                    const updateResult = await tx.outcome.updateMany({
                        where: {
                            id: outcome.id,
                            paid: null,
                        },
                        data: {
                            paid: true,
                        },
                    });

                    if (updateResult.count === 0) {
                        continue;
                    }

                    remainingAmountPence -= gameCostPence;
                    gamesMarkedPaid++;
                }

                return {
                    gamesMarkedPaid,
                    remainingAmountPence,
                };
            });

            const result = {
                playerId: parsed.playerId,
                gamesMarkedPaid: paymentResult.gamesMarkedPaid,
                requestedAmount: fromPence(requestedAmountPence),
                appliedAmount: fromPence(requestedAmountPence - paymentResult.remainingAmountPence),
                remainingAmount: fromPence(paymentResult.remainingAmountPence),
            };

            return PayDebtResultSchema.parse(result);
        } catch (error) {
            log(`Error paying debt: ${String(error)}`);
            throw error;
        }
    }
}

const moneyService = new MoneyService();
export default moneyService;

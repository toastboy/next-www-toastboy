import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import z from 'zod';

import { type PayDebtResult, PayDebtResultSchema } from '@/types/actions/PayDebt';
import type { PlayerBalanceType } from '@/types/DebtType';
import { BalanceSummarySchema } from '@/types/DebtType';

const log = debug('footy:api');

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
            log(`Error fetching money balances: ${String(error)}`);
            throw error;
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
            log(`Error charging player: ${String(error)}`);
            throw error;
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
            log(`Error paying debt: ${String(error)}`);
            throw error;
        }
    }
}

const moneyService = new MoneyService();
export default moneyService;

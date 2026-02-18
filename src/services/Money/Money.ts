import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import z from 'zod';

import { type PayDebtResult, PayDebtResultSchema } from '@/types/actions/PayDebt';
import type { PlayerBalanceType } from '@/types/DebtType';
import { BalanceSummarySchema } from '@/types/DebtType';

const log = debug('footy:api');

// Keep money math in integer pence to avoid floating-point precision issues.
const toPence = (amount: number) => Math.round(amount * 100);
const fromPence = (amount: number) => Number((amount / 100).toFixed(2));

const comparePlayerName = (a: PlayerBalanceType, b: PlayerBalanceType) => {
    const nameComparison = a.playerName.localeCompare(b.playerName);
    if (nameComparison !== 0) return nameComparison;

    // Ensure stable ordering when playerId can be null (e.g. club balance).
    if (a.playerId == null && b.playerId == null) return 0;
    if (a.playerId == null) return 1;
    if (b.playerId == null) return -1;
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

            let clubBalancePence = 0;
            const playerBalances: PlayerBalanceType[] = [];

            for (const row of groupedBalances) {
                const amountPence = -(row._sum.amountPence ?? 0);

                if (row.playerId === null) {
                    clubBalancePence += amountPence;
                    continue;
                }

                const player = playersById.get(row.playerId) ?? {
                    id: row.playerId,
                    name: null,
                    anonymous: false,
                };

                playerBalances.push({
                    playerId: row.playerId,
                    playerName: getPlayerName(player),
                    amount: fromPence(amountPence),
                });
            }

            playerBalances.sort(comparePlayerName);

            const totalPence = groupedBalances.reduce((acc, row) => acc - (row._sum.amountPence ?? 0), 0);
            const positiveTotalPence = groupedBalances.reduce((acc, row) => {
                const amountPence = -(row._sum.amountPence ?? 0);
                return amountPence > 0 ? acc + amountPence : acc;
            }, 0);
            const negativeTotalPence = groupedBalances.reduce((acc, row) => {
                const amountPence = -(row._sum.amountPence ?? 0);
                return amountPence < 0 ? acc + amountPence : acc;
            }, 0);

            return BalanceSummarySchema.parse({
                players: playerBalances,
                club: {
                    playerId: null,
                    playerName: 'Club',
                    amount: fromPence(clubBalancePence),
                },
                total: fromPence(totalPence),
                positiveTotal: fromPence(positiveTotalPence),
                negativeTotal: fromPence(negativeTotalPence),
            });
        } catch (error) {
            log(`Error fetching money balances: ${String(error)}`);
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
                amount: z.number().positive(),
            }).parse({ playerId, amount });

            const requestedAmountPence = toPence(parsed.amount);

            const paymentResult = await prisma.$transaction(async (tx) => {
                const created = await tx.transaction.create({
                    data: {
                        type: 'PlayerPayment',
                        amountPence: -requestedAmountPence,
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
                    resultingBalancePence: aggregate._sum.amountPence ?? 0,
                };
            });

            const resultingBalancePence = -paymentResult.resultingBalancePence;

            return PayDebtResultSchema.parse({
                playerId: parsed.playerId,
                transactionId: paymentResult.transactionId,
                amount: fromPence(requestedAmountPence),
                resultingBalance: fromPence(resultingBalancePence),
            });
        } catch (error) {
            log(`Error paying debt: ${String(error)}`);
            throw error;
        }
    }
}

const moneyService = new MoneyService();
export default moneyService;

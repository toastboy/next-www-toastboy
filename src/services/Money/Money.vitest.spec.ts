import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import moneyService from '@/services/Money';

describe('MoneyService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getBalances', () => {
        it('returns signed balances grouped by playerId including club totals', async () => {
            (prisma.transaction.groupBy as Mock).mockResolvedValue([
                {
                    playerId: 12,
                    _sum: {
                        amountPence: -125,
                    },
                },
                {
                    playerId: 11,
                    _sum: {
                        amountPence: 750,
                    },
                },
                {
                    playerId: null,
                    _sum: {
                        amountPence: -500,
                    },
                },
            ]);

            (prisma.player.findMany as Mock).mockResolvedValue([
                {
                    id: 11,
                    name: 'Alex Current',
                    anonymous: false,
                },
                {
                    id: 12,
                    name: null,
                    anonymous: true,
                },
            ]);

            const result = await moneyService.getBalances();

            expect(prisma.transaction.groupBy).toHaveBeenCalledWith({
                by: ['playerId'],
                _sum: {
                    amountPence: true,
                },
            });
            expect(prisma.player.findMany).toHaveBeenCalledWith({
                where: {
                    id: {
                        in: [12, 11],
                    },
                },
                select: {
                    id: true,
                    name: true,
                    anonymous: true,
                },
            });
            expect(result).toEqual({
                players: [
                    {
                        playerId: 11,
                        playerName: 'Alex Current',
                        amount: -7.5,
                    },
                    {
                        playerId: 12,
                        playerName: 'Player 12',
                        amount: 1.25,
                    },
                ],
                club: {
                    playerId: null,
                    playerName: 'Club',
                    amount: 5,
                },
                total: -1.25,
                positiveTotal: 6.25,
                negativeTotal: -7.5,
            });
        });

        it('returns zeroed summary when there are no transactions', async () => {
            (prisma.transaction.groupBy as Mock).mockResolvedValue([]);

            const result = await moneyService.getBalances();

            expect(prisma.player.findMany).not.toHaveBeenCalled();
            expect(result).toEqual({
                players: [],
                club: {
                    playerId: null,
                    playerName: 'Club',
                    amount: 0,
                },
                total: 0,
                positiveTotal: 0,
                negativeTotal: 0,
            });
        });
    });

    describe('pay', () => {
        it('records a payment as a negative signed transaction and returns the new displayed balance', async () => {
            const create = vi.fn().mockResolvedValue({ id: 77 });
            const aggregate = vi.fn().mockResolvedValue({
                _sum: {
                    amountPence: -250,
                },
            });

            (prisma.$transaction as Mock).mockImplementation(async (callback: (tx: {
                transaction: {
                    create: typeof create,
                    aggregate: typeof aggregate,
                }
            }) => Promise<unknown>) => callback({
                transaction: {
                    create,
                    aggregate,
                },
            }));

            const result = await moneyService.pay(42, 10);

            expect(create).toHaveBeenCalledWith({
                data: {
                    type: 'PlayerPayment',
                    amountPence: -1000,
                    playerId: 42,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(aggregate).toHaveBeenCalledWith({
                where: {
                    playerId: 42,
                },
                _sum: {
                    amountPence: true,
                },
            });
            expect(result).toEqual({
                playerId: 42,
                transactionId: 77,
                amount: 10,
                resultingBalance: 2.5,
            });
        });
    });

    describe('charge', () => {
        it('upserts a player game charge with amount stored in pence', async () => {
            (prisma.transaction.upsert as Mock).mockResolvedValue({});

            await moneyService.charge(14, 3, 9, 12.5, 'Late arrival fee');

            expect(prisma.transaction.upsert).toHaveBeenCalledWith({
                where: {
                    playerId: 14,
                    gameDayId: 3,
                    outcomeId: 9,
                },
                update: {
                    amountPence: 1250,
                    note: 'Late arrival fee',
                },
                create: {
                    type: 'PlayerGameCharge',
                    amountPence: 1250,
                    playerId: 14,
                    gameDayId: 3,
                    outcomeId: 9,
                    note: 'Late arrival fee',
                },
            });
        });
    });
});

import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import gameDayService from '@/services/GameDay';
import moneyService from '@/services/Money';

vi.mock('@/services/GameDay');

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
                    _max: {
                        gameDayId: 22,
                    },
                },
                {
                    playerId: 11,
                    _sum: {
                        amountPence: 750,
                    },
                    _max: {
                        gameDayId: 23,
                    },
                },
                {
                    playerId: null,
                    _sum: {
                        amountPence: -500,
                    },
                    _max: {
                        gameDayId: 23,
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
                _max: {
                    gameDayId: true,
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
                        maxGameDayId: 23,
                        amount: -750,
                    },
                    {
                        playerId: 12,
                        playerName: 'Player 12',
                        maxGameDayId: 22,
                        amount: 125,
                    },
                ],
                total: -125,
                positiveTotal: 625,
                negativeTotal: -750,
            });
        });

        it('returns zeroed summary when there are no transactions', async () => {
            (prisma.transaction.groupBy as Mock).mockResolvedValue([]);

            const result = await moneyService.getBalances();

            expect(prisma.player.findMany).not.toHaveBeenCalled();
            expect(result).toEqual({
                players: [],
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

            const result = await moneyService.pay(42, 1000, 15);

            expect(create).toHaveBeenCalledWith({
                data: {
                    type: 'PlayerPayment',
                    amountPence: -1000,
                    playerId: 42,
                    gameDayId: 15,
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
                amount: 1000,
                resultingBalance: 250,
            });
        });
    });

    describe('getChartData', () => {
        it('returns data grouped by month when year > 0 and transactions exist', async () => {
            (gameDayService.getIdRangeForYear as Mock).mockResolvedValue({ minId: 10, maxId: 12 });

            // PlayerPayment: -500 pence (credit), gameDayId 10
            // HallHire: 1000 pence (debit), gameDayId 11
            (prisma.transaction.groupBy as Mock)
                .mockResolvedValueOnce([
                    { gameDayId: 10, _sum: { amountPence: -500 } },
                ])
                .mockResolvedValueOnce([
                    { gameDayId: 11, _sum: { amountPence: 1000 } },
                ]);

            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { id: 10, date: new Date('2024-03-15T00:00:00Z') },
                { id: 11, date: new Date('2024-04-10T00:00:00Z') },
                { id: 12, date: new Date('2024-04-20T00:00:00Z') },
            ]);

            const result = await moneyService.getChartData(2024);

            expect(gameDayService.getIdRangeForYear).toHaveBeenCalledWith(2024);
            expect(prisma.transaction.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ type: 'PlayerPayment' }) as unknown,
                }),
            );
            expect(prisma.transaction.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ type: 'HallHire' }) as unknown,
                }),
            );
            expect(result).toEqual([
                { interval: 'Mar', credits: 5, debits: 0 },
                { interval: 'Apr', credits: 0, debits: 10 },
            ]);
        });

        it('returns empty array when year > 0 and getIdRangeForYear returns nulls', async () => {
            (gameDayService.getIdRangeForYear as Mock).mockResolvedValue({ minId: null, maxId: null });

            const result = await moneyService.getChartData(2024);

            expect(result).toEqual([]);
            expect(prisma.transaction.groupBy).not.toHaveBeenCalled();
            expect(prisma.gameDay.findMany).not.toHaveBeenCalled();
        });

        it('returns data grouped by year when year === 0 and transactions exist', async () => {
            (gameDayService.getIdRangeForYear as Mock).mockResolvedValue({ minId: 1, maxId: 20 });

            (prisma.transaction.groupBy as Mock)
                .mockResolvedValueOnce([
                    { gameDayId: 1, _sum: { amountPence: -200 } },
                    { gameDayId: 10, _sum: { amountPence: -300 } },
                ])
                .mockResolvedValueOnce([
                    { gameDayId: 10, _sum: { amountPence: 400 } },
                ]);

            (prisma.gameDay.findMany as Mock).mockResolvedValue([
                { id: 1, date: new Date('2023-06-01T00:00:00Z') },
                { id: 10, date: new Date('2024-02-14T00:00:00Z') },
            ]);

            const result = await moneyService.getChartData(0);

            expect(gameDayService.getIdRangeForYear).toHaveBeenCalledWith(0);
            expect(result).toEqual([
                { interval: '2023', credits: 2, debits: 0 },
                { interval: '2024', credits: 3, debits: 4 },
            ]);
        });

        it('returns empty array when year === 0 and getIdRangeForYear returns nulls', async () => {
            (gameDayService.getIdRangeForYear as Mock).mockResolvedValue({ minId: null, maxId: null });

            const result = await moneyService.getChartData(0);

            expect(result).toEqual([]);
            expect(prisma.transaction.groupBy).not.toHaveBeenCalled();
        });

        it('throws when getIdRangeForYear rejects', async () => {
            const dbError = new Error('DB connection failed');
            (gameDayService.getIdRangeForYear as Mock).mockRejectedValue(dbError);

            await expect(moneyService.getChartData(2024)).rejects.toThrow('DB connection failed');
            expect(prisma.transaction.groupBy).not.toHaveBeenCalled();
        });
    });

    describe('charge', () => {
        it('upserts a player game charge with integer amount storage', async () => {
            (prisma.transaction.upsert as Mock).mockResolvedValue({});

            await moneyService.charge(14, 3, 1250, 'Late arrival fee');

            expect(prisma.transaction.upsert).toHaveBeenCalledWith({
                where: {
                    type_playerId_gameDayId: {
                        type: 'PlayerGameCharge',
                        playerId: 14,
                        gameDayId: 3,
                    },
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
                    note: 'Late arrival fee',
                },
            });
        });
    });

    describe('recordHallHire', () => {
        it('updates an existing hall-hire transaction for the game day when present', async () => {
            (prisma.transaction.updateMany as Mock).mockResolvedValue({ count: 1 });

            await moneyService.recordHallHire(
                4700,
                1261,
                'Kelsey Kerridge invoice April 2026, game day 1261 on 2026-04-28',
            );

            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: {
                    type: 'HallHire',
                    playerId: null,
                    gameDayId: 1261,
                },
                data: {
                    amountPence: 4700,
                    note: 'Kelsey Kerridge invoice April 2026, game day 1261 on 2026-04-28',
                },
            });
            expect(prisma.transaction.create).not.toHaveBeenCalled();
        });

        it('creates a hall-hire transaction when no existing row matches', async () => {
            (prisma.transaction.updateMany as Mock).mockResolvedValue({ count: 0 });
            (prisma.transaction.create as Mock).mockResolvedValue({});

            await moneyService.recordHallHire(4700, 1261, 'April invoice');

            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: {
                    type: 'HallHire',
                    playerId: null,
                    gameDayId: 1261,
                },
                data: {
                    amountPence: 4700,
                    note: 'April invoice',
                },
            });
            expect(prisma.transaction.create).toHaveBeenCalledWith({
                data: {
                    type: 'HallHire',
                    amountPence: 4700,
                    playerId: null,
                    gameDayId: 1261,
                    note: 'April invoice',
                },
            });
        });
    });
});

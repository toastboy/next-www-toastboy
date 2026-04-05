import prisma from 'prisma/prisma';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

import gameDayService from '@/services/GameDay';
import moneyService from '@/services/Money';
import playerService from '@/services/Player';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockPlayer } from '@/tests/mocks/data/player';

vi.mock('@/services/GameDay');
vi.mock('@/services/Player');

describe('MoneyService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
        it('creates a new HallHire transaction when none exists for the gameDay', async () => {
            (prisma.transaction.updateMany as Mock).mockResolvedValue({ count: 0 });
            (prisma.transaction.create as Mock).mockResolvedValue({});

            await moneyService.recordHallHire(5000, 42, 'Weekly hall hire');

            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: {
                    type: 'HallHire',
                    playerId: null,
                    gameDayId: 42,
                },
                data: {
                    amountPence: 5000,
                    note: 'Weekly hall hire',
                },
            });
            expect(prisma.transaction.create).toHaveBeenCalledWith({
                data: {
                    type: 'HallHire',
                    amountPence: 5000,
                    playerId: null,
                    gameDayId: 42,
                    note: 'Weekly hall hire',
                },
            });
        });

        it('updates an existing HallHire transaction when one already exists for the gameDay', async () => {
            (prisma.transaction.updateMany as Mock).mockResolvedValue({ count: 1 });

            await moneyService.recordHallHire(7500, 10);

            expect(prisma.transaction.updateMany).toHaveBeenCalledWith({
                where: {
                    type: 'HallHire',
                    playerId: null,
                    gameDayId: 10,
                },
                data: {
                    amountPence: 7500,
                    note: undefined,
                },
            });
            expect(prisma.transaction.create).not.toHaveBeenCalled();
        });

        it('throws when amountPence exceeds the maximum allowed value', async () => {
            await expect(moneyService.recordHallHire(1000000, 42)).rejects.toThrow();
        });
    });

    describe('getDebts', () => {
        it('returns unpaid game charges grouped by player and aggregated totals', async () => {
            const player11 = createMockPlayer({
                id: 11,
                name: 'Player 11',
            });
            const player21 = createMockPlayer({
                id: 21,
                name: 'Player 21',
            });

            const gameDay8 = createMockGameDay({ id: 8 });
            const gameDay10 = createMockGameDay({ id: 10 });
            const gameDay15 = createMockGameDay({ id: 15 });

            (playerService.getById as Mock).mockImplementation((id: number) => {
                if (id === 11) return player11;
                if (id === 21) return player21;
                return null;
            });

            (gameDayService.get as Mock).mockImplementation((id: number) => {
                if (id === 8) return gameDay8;
                if (id === 10) return gameDay10;
                if (id === 15) return gameDay15;
                return null;
            });

            (prisma.transaction.findMany as Mock)
                .mockResolvedValueOnce([
                    {
                        playerId: 11,
                        gameDayId: 8,
                        amountPence: 350,
                    },
                    {
                        playerId: 11,
                        gameDayId: 10,
                        amountPence: 400,
                    },
                    {
                        playerId: 21,
                        gameDayId: 15,
                        amountPence: 600,
                    },
                ])
                .mockResolvedValueOnce([
                    {
                        playerId: 11,
                        gameDayId: 10,
                    },
                ]);

            (prisma.transaction.aggregate as Mock)
                .mockResolvedValueOnce({
                    _sum: {
                        amountPence: -1200,
                    },
                })
                .mockResolvedValueOnce({
                    _sum: {
                        amountPence: -2600,
                    },
                });

            const result = await moneyService.getDebts();

            expect(prisma.transaction.findMany).toHaveBeenNthCalledWith(1, {
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

            expect(prisma.transaction.findMany).toHaveBeenNthCalledWith(2, {
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

            expect(result).toEqual({
                players: [
                    {
                        player: player11,
                        debts: [
                            { gameDay: gameDay8, amount: 350 },
                        ],
                    },
                    {
                        player: player21,
                        debts: [
                            { gameDay: gameDay15, amount: 600 },
                        ],
                    },
                ],
            });
        });

        it('returns empty players array when there are no unpaid charges', async () => {
            (prisma.transaction.findMany as Mock)
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([]);
            (prisma.transaction.aggregate as Mock)
                .mockResolvedValueOnce({
                    _sum: {
                        amountPence: 0,
                    },
                })
                .mockResolvedValueOnce({
                    _sum: {
                        amountPence: 0,
                    },
                });

            const result = await moneyService.getDebts();

            expect(result).toEqual({
                players: [],
            });
        });
    });

    describe('payMultiple', () => {
        it('records payments as negative transactions for each gameDayId and distributes amount evenly', async () => {
            const create = vi.fn()
                .mockResolvedValueOnce({ id: 101 })
                .mockResolvedValueOnce({ id: 102 })
                .mockResolvedValueOnce({ id: 103 });
            const aggregate = vi.fn().mockResolvedValue({
                _sum: {
                    amountPence: -500,
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

            const result = await moneyService.payMultiple(42, 1200, [8, 10, 15]);

            expect(create).toHaveBeenCalledTimes(3);
            // 1200 / 3 = 400 each, remainder 0, so first gets 400 + 0 = 400
            expect(create).toHaveBeenNthCalledWith(1, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -400,
                    playerId: 42,
                    gameDayId: 8,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(create).toHaveBeenNthCalledWith(2, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -400,
                    playerId: 42,
                    gameDayId: 10,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(create).toHaveBeenNthCalledWith(3, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -400,
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
                transactionIds: [101, 102, 103],
                amount: 1200,
                resultingBalance: 500,
            });
        });

        it('distributes remainder amount to first transaction when amount does not divide evenly', async () => {
            const create = vi.fn()
                .mockResolvedValueOnce({ id: 201 })
                .mockResolvedValueOnce({ id: 202 })
                .mockResolvedValueOnce({ id: 203 })
                .mockResolvedValueOnce({ id: 204 });
            const aggregate = vi.fn().mockResolvedValue({
                _sum: {
                    amountPence: -100,
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

            // 1003 / 4 = 250 each, remainder 3, so first gets 250 + 3 = 253
            const result = await moneyService.payMultiple(42, 1003, [1, 2, 3, 4]);

            expect(create).toHaveBeenCalledTimes(4);
            expect(create).toHaveBeenNthCalledWith(1, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -253,
                    playerId: 42,
                    gameDayId: 1,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(create).toHaveBeenNthCalledWith(2, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -250,
                    playerId: 42,
                    gameDayId: 2,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(create).toHaveBeenNthCalledWith(3, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -250,
                    playerId: 42,
                    gameDayId: 3,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(create).toHaveBeenNthCalledWith(4, {
                data: {
                    type: 'PlayerPayment',
                    amountPence: -250,
                    playerId: 42,
                    gameDayId: 4,
                    note: 'Manual payment',
                },
                select: {
                    id: true,
                },
            });
            expect(result).toEqual({
                playerId: 42,
                transactionIds: [201, 202, 203, 204],
                amount: 1003,
                resultingBalance: 100,
            });
        });
    });
});

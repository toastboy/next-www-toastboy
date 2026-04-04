import { describe, expect, it, vi } from 'vitest';

import { payDebtCore } from '@/lib/actions/payDebt';

describe('payDebtCore', () => {
    it('delegates payment to moneyService.payMultiple', async () => {
        const payMultiple = vi.fn().mockResolvedValue({
            playerId: 42,
            transactionIds: [15, 16],
            amount: 1000,
            resultingBalance: 250,
        });

        const result = await payDebtCore(
            {
                gameDayIds: [5, 7],
                playerId: 42,
                amount: 1000,
            },
            {
                moneyService: {
                    payMultiple,
                },
            },
        );

        expect(payMultiple).toHaveBeenCalledWith(42, 1000, [5, 7]);
        expect(result).toEqual({
            playerId: 42,
            transactionIds: [15, 16],
            amount: 1000,
            resultingBalance: 250,
        });
    });
});

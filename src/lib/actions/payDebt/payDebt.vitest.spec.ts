import { describe, expect, it, vi } from 'vitest';

import { payDebtCore } from '@/lib/actions/payDebt';

describe('payDebtCore', () => {
    it('delegates payment to moneyService', async () => {
        const pay = vi.fn().mockResolvedValue({
            playerId: 42,
            transactionId: 15,
            amount: 10,
            resultingBalance: 2.5,
        });

        const result = await payDebtCore(
            {
                playerId: 42,
                amount: 10,
            },
            {
                moneyService: {
                    pay,
                },
            },
        );

        expect(pay).toHaveBeenCalledWith(42, 10);
        expect(result).toEqual({
            playerId: 42,
            transactionId: 15,
            amount: 10,
            resultingBalance: 2.5,
        });
    });
});

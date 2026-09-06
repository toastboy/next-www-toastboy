import { describe, expect, it, vi } from 'vitest';

import { coreRecordHallHire } from '@/lib/core/recordHallHire';

describe('coreRecordHallHire', () => {
    it('delegates to moneyService.recordHallHire with all fields', async () => {
        const recordHallHire = vi.fn().mockResolvedValue(undefined);

        await coreRecordHallHire(
            { amountPence: 5000, gameDayId: 42, note: 'Weekly hall hire' },
            { moneyService: { recordHallHire } },
        );

        expect(recordHallHire).toHaveBeenCalledWith(
            5000,
            42,
            'Weekly hall hire',
        );
    });

    it('delegates to moneyService.recordHallHire without optional note', async () => {
        const recordHallHire = vi.fn().mockResolvedValue(undefined);

        await coreRecordHallHire(
            { amountPence: 7500, gameDayId: 10 },
            { moneyService: { recordHallHire } },
        );

        expect(recordHallHire).toHaveBeenCalledWith(7500, 10, undefined);
    });
});

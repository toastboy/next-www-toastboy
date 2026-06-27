import { describe, expect, it, vi } from 'vitest';

import { updateInvoiceGameDaysCore } from '@/lib/actions/updateInvoiceGameDays';

describe('updateInvoiceGameDaysCore', () => {
    it('calls gameDayService.update for each game day with the correct id and game flag', async () => {
        const update = vi.fn().mockResolvedValue(undefined);

        await updateInvoiceGameDaysCore(
            {
                gameDays: [
                    { id: 10, gameScheduled: true },
                    { id: 20, gameScheduled: false },
                ],
            },
            { gameDayService: { update } },
        );

        expect(update).toHaveBeenCalledTimes(2);
        expect(update).toHaveBeenCalledWith({ id: 10, game: true });
        expect(update).toHaveBeenCalledWith({ id: 20, game: false });
    });

    it('resolves immediately when the game day list is empty', async () => {
        const update = vi.fn().mockResolvedValue(undefined);

        await updateInvoiceGameDaysCore({ gameDays: [] }, { gameDayService: { update } });

        expect(update).not.toHaveBeenCalled();
    });

    it('propagates service errors', async () => {
        const serviceError = new Error('DB timeout');
        const update = vi.fn().mockRejectedValue(serviceError);

        await expect(
            updateInvoiceGameDaysCore(
                { gameDays: [{ id: 1, gameScheduled: true }] },
                { gameDayService: { update } },
            ),
        ).rejects.toBe(serviceError);
    });
});

import { describe, expect, it, vi } from 'vitest';

import { updateInvoiceGameDaysCore } from '@/lib/core/updateInvoiceGameDays';

describe('updateInvoiceGameDaysCore', () => {
    it('calls gameDayService.update for each game day with the correct id and status', async () => {
        const get = vi
            .fn()
            .mockResolvedValueOnce({ id: 10, status: 'Scheduled' })
            .mockResolvedValueOnce({ id: 20, status: 'NoGame' });
        const update = vi.fn().mockResolvedValue(undefined);

        await updateInvoiceGameDaysCore(
            {
                gameDays: [
                    { id: 10, gameScheduled: true },
                    { id: 20, gameScheduled: false },
                ],
            },
            { gameDayService: { get, update } },
        );

        expect(update).toHaveBeenCalledTimes(2);
        expect(update).toHaveBeenCalledWith({ id: 10, status: 'Scheduled' });
        expect(update).toHaveBeenCalledWith({ id: 20, status: 'NoGame' });
    });

    it('resolves immediately when the game day list is empty', async () => {
        const get = vi.fn().mockResolvedValue(null);
        const update = vi.fn().mockResolvedValue(undefined);

        await updateInvoiceGameDaysCore(
            { gameDays: [] },
            { gameDayService: { get, update } },
        );

        expect(get).not.toHaveBeenCalled();
        expect(update).not.toHaveBeenCalled();
    });

    it('propagates service errors', async () => {
        const get = vi.fn().mockResolvedValue({ id: 1, status: 'Scheduled' });
        const serviceError = new Error('DB timeout');
        const update = vi.fn().mockRejectedValue(serviceError);

        await expect(
            updateInvoiceGameDaysCore(
                { gameDays: [{ id: 1, gameScheduled: true }] },
                { gameDayService: { get, update } },
            ),
        ).rejects.toBe(serviceError);
    });

    it('rejects with a ConflictError instead of overwriting a decided game day', async () => {
        const get = vi.fn().mockResolvedValue({ id: 30, status: 'AWin' });
        const update = vi.fn().mockResolvedValue(undefined);

        await expect(
            updateInvoiceGameDaysCore(
                { gameDays: [{ id: 30, gameScheduled: false }] },
                { gameDayService: { get, update } },
            ),
        ).rejects.toMatchObject({
            name: 'ConflictError',
            details: { gameDayIds: [30] },
        });

        expect(update).not.toHaveBeenCalled();
    });

    it('rejects the whole batch if any game day in it is decided, leaving none updated', async () => {
        const get = vi
            .fn()
            .mockResolvedValueOnce({ id: 10, status: 'Scheduled' })
            .mockResolvedValueOnce({ id: 20, status: 'BWin' });
        const update = vi.fn().mockResolvedValue(undefined);

        await expect(
            updateInvoiceGameDaysCore(
                {
                    gameDays: [
                        { id: 10, gameScheduled: true },
                        { id: 20, gameScheduled: true },
                    ],
                },
                { gameDayService: { get, update } },
            ),
        ).rejects.toMatchObject({ details: { gameDayIds: [20] } });

        expect(update).not.toHaveBeenCalled();
    });

    it('ignores a game day that no longer exists rather than treating it as decided', async () => {
        const get = vi.fn().mockResolvedValue(null);
        const update = vi.fn().mockResolvedValue(undefined);

        await updateInvoiceGameDaysCore(
            { gameDays: [{ id: 99, gameScheduled: true }] },
            { gameDayService: { get, update } },
        );

        expect(update).toHaveBeenCalledWith({ id: 99, status: 'Scheduled' });
    });
});

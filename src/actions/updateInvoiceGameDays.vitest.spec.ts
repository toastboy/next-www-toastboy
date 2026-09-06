import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    revalidatePathMock,
    broadcastMock,
    requireAdminMock,
    coreUpdateInvoiceGameDaysMock,
} = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    coreUpdateInvoiceGameDaysMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/updateInvoiceGameDays', () => ({
    coreUpdateInvoiceGameDays: coreUpdateInvoiceGameDaysMock,
}));

import { updateInvoiceGameDays } from '@/actions/updateInvoiceGameDays';
import { FootyChannel } from '@/types/FootyChannel';

describe('updateInvoiceGameDays action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('validates input, calls core, revalidates, and broadcasts on success', async () => {
        await updateInvoiceGameDays({
            gameDays: [
                { id: 1, gameScheduled: true },
                { id: 2, gameScheduled: false },
            ],
        });

        expect(coreUpdateInvoiceGameDaysMock).toHaveBeenCalledWith({
            gameDays: [
                { id: 1, gameScheduled: true },
                { id: 2, gameScheduled: false },
            ],
        });
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/invoice');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/fixtures');
        expect(broadcastMock).toHaveBeenCalledWith([
            FootyChannel.Money,
            FootyChannel.Games,
        ]);
    });

    it('propagates errors thrown by the core without revalidating', async () => {
        const coreError = new Error('core failed');
        coreUpdateInvoiceGameDaysMock.mockRejectedValue(coreError);

        await expect(
            updateInvoiceGameDays({
                gameDays: [{ id: 1, gameScheduled: true }],
            }),
        ).rejects.toBe(coreError);

        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, recordHallHireCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    recordHallHireCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/recordHallHire', () => ({
    recordHallHireCore: recordHallHireCoreMock,
}));

import { recordHallHire } from '@/actions/recordHallHire';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    amountPence: 2500,
    gameDayId: 1249,
    note: 'Hall hire for the season',
};

describe('recordHallHire action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to core, revalidates money and invoice paths, and broadcasts Money channel', async () => {
        await recordHallHire(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(recordHallHireCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/money');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/invoice');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Money);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(recordHallHire(validInput)).rejects.toBe(authError);
        expect(recordHallHireCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(recordHallHire({ ...validInput, amountPence: -1 })).rejects.toThrow();
        expect(recordHallHireCoreMock).not.toHaveBeenCalled();
    });
});

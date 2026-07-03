import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, payDebtCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    payDebtCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/payDebt', () => ({
    payDebtCore: payDebtCoreMock,
}));

import { payDebt } from '@/actions/payDebt';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    playerId: 7,
    amount: 500,
    gameDayIds: [1249, 1250],
};

describe('payDebt action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to core, revalidates money and game paths, and broadcasts Money channel', async () => {
        await payDebt(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(payDebtCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/money');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Money);
    });

    it('returns the result from core', async () => {
        const result = { playerId: 7, transactionIds: [1, 2], amount: 500, resultingBalance: 0 };
        payDebtCoreMock.mockResolvedValueOnce(result);

        const returned = await payDebt(validInput);

        expect(returned).toBe(result);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(payDebt(validInput)).rejects.toBe(authError);
        expect(payDebtCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(payDebt({ ...validInput, gameDayIds: [] })).rejects.toThrow();
        expect(payDebtCoreMock).not.toHaveBeenCalled();
    });
});

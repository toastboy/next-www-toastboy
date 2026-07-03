import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, submitPickerCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    submitPickerCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/submitPicker', () => ({
    SubmitPickerCore: submitPickerCoreMock,
}));

import { SubmitPicker } from '@/actions/submitPicker';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = [{ playerId: 1 }, { playerId: 2 }];

describe('SubmitPicker action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to SubmitPickerCore, revalidates the game path, and broadcasts Games channel', async () => {
        await SubmitPicker(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(submitPickerCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Games);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(SubmitPicker(validInput)).rejects.toBe(authError);
        expect(submitPickerCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(SubmitPicker([{ playerId: 0 }])).rejects.toThrow();
        expect(submitPickerCoreMock).not.toHaveBeenCalled();
    });
});

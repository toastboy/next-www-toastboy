import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, setGameEnabledCoreMock, sendEmailToAllActivePlayersMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    setGameEnabledCoreMock: vi.fn(),
    sendEmailToAllActivePlayersMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/setGameEnabled', () => ({
    setGameEnabledCore: setGameEnabledCoreMock,
}));
vi.mock('@/actions/sendEmailToAllActivePlayers', () => ({
    sendEmailToAllActivePlayers: sendEmailToAllActivePlayersMock,
}));

import { setGameEnabled } from '@/actions/setGameEnabled';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    gameDayId: 1249,
    game: false,
    reason: 'Pitch waterlogged',
};

describe('setGameEnabled action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to core (passing the email action), revalidates affected paths, and broadcasts Games channel', async () => {
        await setGameEnabled(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(setGameEnabledCoreMock).toHaveBeenCalledWith(validInput, sendEmailToAllActivePlayersMock);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/responses');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/fixtures');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/picker');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/game');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Games);
    });

    it('returns the updated gameDay from core', async () => {
        const gameDay = { id: 1249, game: false };
        setGameEnabledCoreMock.mockResolvedValueOnce(gameDay);

        const result = await setGameEnabled(validInput);

        expect(result).toBe(gameDay);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(setGameEnabled(validInput)).rejects.toBe(authError);
        expect(setGameEnabledCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(setGameEnabled({ ...validInput, gameDayId: 0 })).rejects.toThrow();
        expect(setGameEnabledCoreMock).not.toHaveBeenCalled();
    });
});

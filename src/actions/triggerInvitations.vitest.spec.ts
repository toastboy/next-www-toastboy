import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, triggerInvitationsCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    triggerInvitationsCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/triggerInvitations', () => ({
    triggerInvitationsCore: triggerInvitationsCoreMock,
}));

import { triggerInvitations } from '@/actions/triggerInvitations';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    overrideTimeCheck: false,
    customMessage: 'See you all there',
};

describe('triggerInvitations action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to core, revalidates four affected paths, and broadcasts Invitations channel', async () => {
        await triggerInvitations(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(triggerInvitationsCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledTimes(4);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/newgame');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/responses');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/picker');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/response');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Invitations);
    });

    it('returns the invitation decision from core', async () => {
        const decision = { status: 'sent', gameDayId: 1249 };
        triggerInvitationsCoreMock.mockResolvedValueOnce(decision);

        const result = await triggerInvitations(validInput);

        expect(result).toBe(decision);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(triggerInvitations(validInput)).rejects.toBe(authError);
        expect(triggerInvitationsCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(triggerInvitations({ overrideTimeCheck: 'nope' })).rejects.toThrow();
        expect(triggerInvitationsCoreMock).not.toHaveBeenCalled();
    });
});

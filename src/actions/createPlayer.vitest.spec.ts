import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, requireAdminMock, createPlayerCoreMock, addPlayerInviteCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    createPlayerCoreMock: vi.fn(),
    addPlayerInviteCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/createPlayer', () => ({
    createPlayerCore: createPlayerCoreMock,
    addPlayerInviteCore: addPlayerInviteCoreMock,
}));

import { addPlayerInvite, createPlayer } from '@/actions/createPlayer';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    name: 'Alice',
    email: 'alice@example.com',
    introducedBy: '',
};

describe('createPlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, validates input, delegates to core, revalidates newplayer and players, and broadcasts Players channel', async () => {
        await createPlayer(validInput);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(createPlayerCoreMock).toHaveBeenCalledWith(validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/newplayer');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/players');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Players);
    });

    it('returns the created player from core', async () => {
        const result = { player: { id: 1 }, inviteLink: 'https://example.com/invite' };
        createPlayerCoreMock.mockResolvedValueOnce(result);

        const returned = await createPlayer(validInput);

        expect(returned).toBe(result);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(createPlayer(validInput)).rejects.toBe(authError);
        expect(createPlayerCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('propagates ZodError when input validation fails', async () => {
        await expect(createPlayer({ ...validInput, name: '' })).rejects.toThrow();
        expect(createPlayerCoreMock).not.toHaveBeenCalled();
    });
});

describe('addPlayerInvite action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('calls requireAdmin, delegates to addPlayerInviteCore, revalidates affected paths, and broadcasts Players channel', async () => {
        await addPlayerInvite(7, 'bob@example.com');

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(addPlayerInviteCoreMock).toHaveBeenCalledWith(7, 'bob@example.com');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/newplayer');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/players');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Players);
    });

    it('returns the invite link from core', async () => {
        addPlayerInviteCoreMock.mockResolvedValueOnce('https://example.com/invite/abc');

        const result = await addPlayerInvite(7);

        expect(result).toBe('https://example.com/invite/abc');
    });

    it('propagates AuthError when requireAdmin throws', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(addPlayerInvite(7)).rejects.toBe(authError);
        expect(addPlayerInviteCoreMock).not.toHaveBeenCalled();
    });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { revalidatePathMock, broadcastMock, updatePlayerCoreMock } = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    updatePlayerCoreMock: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/updatePlayer', () => ({
    updatePlayerCore: updatePlayerCoreMock,
}));

import { updatePlayer } from '@/actions/updatePlayer';
import { FootyChannel } from '@/types/FootyChannel';

const validInput = {
    name: 'Alice',
    accountEmail: 'alice@example.com',
    born: null,
    extraEmails: [],
    addedExtraEmails: [],
    removedExtraEmails: [],
    countries: [],
    clubs: [],
};

describe('updatePlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('validates input, delegates to core with playerId, revalidates players/profile/player-detail paths, and broadcasts Players channel', async () => {
        await updatePlayer(7, validInput);

        expect(updatePlayerCoreMock).toHaveBeenCalledWith(7, validInput);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/players');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/profile');
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/player/7');
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Players);
    });

    it('returns the updated player from core', async () => {
        const player = { id: 7, name: 'Alice' };
        updatePlayerCoreMock.mockResolvedValueOnce(player);

        const result = await updatePlayer(7, validInput);

        expect(result).toBe(player);
    });

    it('propagates ZodError when input validation fails without revalidating', async () => {
        await expect(updatePlayer(7, { ...validInput, name: '' })).rejects.toThrow();
        expect(updatePlayerCoreMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });

    it('includes the playerId in the player-detail revalidation path', async () => {
        await updatePlayer(42, validInput);

        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/player/42');
    });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { beforeDeletePlayerCoreMock, deletePlayerCoreMock } = vi.hoisted(() => ({
    beforeDeletePlayerCoreMock: vi.fn().mockResolvedValue(undefined),
    deletePlayerCoreMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/core/deletePlayer', () => ({
    beforeDeletePlayerCore: beforeDeletePlayerCoreMock,
    deletePlayerCore: deletePlayerCoreMock,
}));

import { beforeDeletePlayer, deletePlayer } from '@/actions/deletePlayer';
import type { AuthUserSummary } from '@/types/AuthUser';

const user: AuthUserSummary = {
    name: 'Alice',
    email: 'alice@example.com',
    playerId: 7,
    role: 'user',
};

describe('beforeDeletePlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to beforeDeletePlayerCore with the provided user summary', async () => {
        await beforeDeletePlayer(user);

        expect(beforeDeletePlayerCoreMock).toHaveBeenCalledWith(user);
    });

    it('propagates errors from beforeDeletePlayerCore', async () => {
        const coreError = new Error('cleanup failed');
        beforeDeletePlayerCoreMock.mockRejectedValueOnce(coreError);

        await expect(beforeDeletePlayer(user)).rejects.toBe(coreError);
    });
});

describe('deletePlayer action wrapper', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('delegates to deletePlayerCore', async () => {
        await deletePlayer();

        expect(deletePlayerCoreMock).toHaveBeenCalledTimes(1);
    });

    it('propagates errors from deletePlayerCore', async () => {
        const coreError = new Error('delete failed');
        deletePlayerCoreMock.mockRejectedValueOnce(coreError);

        await expect(deletePlayer()).rejects.toBe(coreError);
    });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { coreBeforeDeletePlayerMock, coreDeletePlayerMock } = vi.hoisted(() => ({
    coreBeforeDeletePlayerMock: vi.fn().mockResolvedValue(undefined),
    coreDeletePlayerMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/core/deletePlayer', () => ({
    coreBeforeDeletePlayer: coreBeforeDeletePlayerMock,
    coreDeletePlayer: coreDeletePlayerMock,
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
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreBeforeDeletePlayer with the provided user summary', async () => {
        await beforeDeletePlayer(user);

        expect(coreBeforeDeletePlayerMock).toHaveBeenCalledWith(user);
    });

    it('propagates errors from coreBeforeDeletePlayer', async () => {
        const coreError = new Error('cleanup failed');
        coreBeforeDeletePlayerMock.mockRejectedValueOnce(coreError);

        await expect(beforeDeletePlayer(user)).rejects.toBe(coreError);
    });
});

describe('deletePlayer action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('delegates to coreDeletePlayer', async () => {
        await deletePlayer();

        expect(coreDeletePlayerMock).toHaveBeenCalledTimes(1);
    });

    it('propagates errors from coreDeletePlayer', async () => {
        const coreError = new Error('delete failed');
        coreDeletePlayerMock.mockRejectedValueOnce(coreError);

        await expect(deletePlayer()).rejects.toBe(coreError);
    });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    revalidatePathMock,
    broadcastMock,
    requireAdminMock,
    coreUpdatePlayerRecordsMock,
} = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    coreUpdatePlayerRecordsMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/updatePlayerRecords', () => ({
    coreUpdatePlayerRecords: coreUpdatePlayerRecordsMock,
}));

import { updatePlayerRecords } from '@/actions/updatePlayerRecords';
import { FootyChannel } from '@/types/FootyChannel';

describe('updatePlayerRecords action wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls requireAdmin, delegates to core, revalidates the admin path, and broadcasts Players and Results channels', async () => {
        await updatePlayerRecords();

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(coreUpdatePlayerRecordsMock).toHaveBeenCalledTimes(1);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin');
        expect(broadcastMock).toHaveBeenCalledWith([
            FootyChannel.Players,
            FootyChannel.Results,
        ]);
    });

    it('propagates AuthError when requireAdmin throws without revalidating', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(updatePlayerRecords()).rejects.toBe(authError);
        expect(coreUpdatePlayerRecordsMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });
});

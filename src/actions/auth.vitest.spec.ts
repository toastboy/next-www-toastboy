import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
    revalidatePathMock,
    broadcastMock,
    requireAdminMock,
    coreListUsersActionMock,
    coreSetAdminRoleActionMock,
} = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    broadcastMock: vi.fn(),
    requireAdminMock: vi.fn().mockResolvedValue(undefined),
    coreListUsersActionMock: vi.fn().mockResolvedValue([]),
    coreSetAdminRoleActionMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('next/cache', () => ({ revalidatePath: revalidatePathMock }));
vi.mock('@/lib/auth.server', () => ({ requireAdmin: requireAdminMock }));
vi.mock('@/lib/events', () => ({ broadcast: broadcastMock }));
vi.mock('@/lib/core/auth', () => ({
    coreListUsersAction: coreListUsersActionMock,
    coreSetAdminRoleAction: coreSetAdminRoleActionMock,
}));

import { listUsersAction, setAdminRoleAction } from '@/actions/auth';
import { FootyChannel } from '@/types/FootyChannel';

describe('listUsersAction wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls requireAdmin then returns the result of coreListUsersAction', async () => {
        const users = [{ id: 'u1' }];
        coreListUsersActionMock.mockResolvedValueOnce(users);

        const result = await listUsersAction();

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(result).toBe(users);
    });

    it('passes the optional email and limit arguments to coreListUsersAction', async () => {
        await listUsersAction('alice@example.com', 1000);

        expect(coreListUsersActionMock).toHaveBeenCalledWith(
            'alice@example.com',
            1000,
        );
    });

    it('propagates AuthError when requireAdmin throws', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(listUsersAction()).rejects.toBe(authError);
        expect(coreListUsersActionMock).not.toHaveBeenCalled();
    });
});

describe('setAdminRoleAction wrapper', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls requireAdmin, coreSetAdminRoleAction, revalidatePath for both user paths, and broadcasts Users channel', async () => {
        await setAdminRoleAction('user-1', true);

        expect(requireAdminMock).toHaveBeenCalledTimes(1);
        expect(coreSetAdminRoleActionMock).toHaveBeenCalledWith('user-1', true);
        expect(revalidatePathMock).toHaveBeenCalledWith('/footy/admin/users');
        expect(revalidatePathMock).toHaveBeenCalledWith(
            '/footy/admin/user',
            'layout',
        );
        expect(broadcastMock).toHaveBeenCalledWith(FootyChannel.Users);
    });

    it('propagates AuthError when requireAdmin throws without calling revalidatePath or broadcast', async () => {
        const authError = new Error('not an admin');
        requireAdminMock.mockRejectedValueOnce(authError);

        await expect(setAdminRoleAction('user-1', false)).rejects.toBe(
            authError,
        );
        expect(coreSetAdminRoleActionMock).not.toHaveBeenCalled();
        expect(revalidatePathMock).not.toHaveBeenCalled();
        expect(broadcastMock).not.toHaveBeenCalled();
    });
});

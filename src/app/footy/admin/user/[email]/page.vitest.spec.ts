import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/actions/auth', () => ({
    listUsersAction: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
}));

vi.mock('@/components/AdminUserData/AdminUserData', () => ({
    AdminUserData: function AdminUserData() { return null; },
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

import { listUsersAction } from '@/actions/auth';
import AdminUserPage from '@/app/footy/admin/user/[email]/page';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { findElement } from '@/tests/shared/reactTree';
import { FootyChannel } from '@/types/FootyChannel';

const user = { id: 'user-1', email: 'alice@example.com' };

describe('Admin User [email] page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('URL-decodes the email param before passing it to listUsersAction', async () => {
        (listUsersAction as Mock).mockResolvedValue([user]);

        await AdminUserPage({ params: Promise.resolve({ email: 'alice%40example.com' }) });

        expect(listUsersAction).toHaveBeenCalledWith('alice@example.com');
    });

    it('falls back to the raw email param, without capturing an unexpected error, when it is malformed percent-encoding', async () => {
        (listUsersAction as Mock).mockResolvedValue([]);

        // '%' not followed by two hex digits is malformed and would make a bare
        // decodeURIComponent() throw a URIError.
        await expect(
            AdminUserPage({ params: Promise.resolve({ email: '50%off' }) }),
        ).rejects.toThrow('not_found');

        expect(listUsersAction).toHaveBeenCalledWith('50%off');
        expect(captureUnexpectedError).not.toHaveBeenCalled();
    });

    it('renders AdminUserData and AutoRefresh (Users channel) when the user is found', async () => {
        (listUsersAction as Mock).mockResolvedValue([user]);

        const result = await AdminUserPage({ params: Promise.resolve({ email: 'alice@example.com' }) });

        const userData = findElement(result, 'AdminUserData');
        expect(userData?.props.user).toBe(user);
        const autoRefresh = findElement(result, 'AutoRefresh');
        expect(autoRefresh?.props.channels).toBe(FootyChannel.Users);
    });

    it('calls notFound when listUsersAction returns an empty result', async () => {
        (listUsersAction as Mock).mockResolvedValue([]);

        await expect(
            AdminUserPage({ params: Promise.resolve({ email: 'alice@example.com' }) }),
        ).rejects.toThrow('not_found');
    });

    it('calls captureUnexpectedError and calls notFound when listUsersAction throws', async () => {
        const coreError = new Error('lookup failed');
        (listUsersAction as Mock).mockRejectedValue(coreError);

        await expect(
            AdminUserPage({ params: Promise.resolve({ email: 'alice@example.com' }) }),
        ).rejects.toThrow('not_found');

        expect(captureUnexpectedError).toHaveBeenCalledWith(coreError, {
            layer: 'server',
            action: 'listUsersAction',
            component: 'AdminUserPage',
            route: '/footy/admin/user/[email]',
            extra: {
                email: 'alice@example.com',
            },
        });
    });
});

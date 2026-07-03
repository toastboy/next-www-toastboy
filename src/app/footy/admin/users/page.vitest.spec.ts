import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/actions/auth', () => ({
    listUsersAction: vi.fn(),
    setAdminRoleAction: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

vi.mock('@mantine/core', () => ({
    Container: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AdminUserList/AdminUserList', () => ({
    AdminUserList: function AdminUserList() { return null; },
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

import { listUsersAction, setAdminRoleAction } from '@/actions/auth';
import Page from '@/app/footy/admin/users/page';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { findElement } from '@/tests/shared/reactTree';
import { FootyChannel } from '@/types/FootyChannel';

const users = [{ id: 'user-1', email: 'alice@example.com', role: 'user' }];

describe('Admin Users page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches all users via listUsersAction', async () => {
        (listUsersAction as Mock).mockResolvedValue(users);

        await Page();

        expect(listUsersAction).toHaveBeenCalledTimes(1);
    });

    it('passes users and setAdminRole to AdminUserList', async () => {
        (listUsersAction as Mock).mockResolvedValue(users);

        const result = await Page();

        const list = findElement(result, 'AdminUserList');
        expect(list?.props.users).toBe(users);
        expect(list?.props.setAdminRole).toBe(setAdminRoleAction);

        const autoRefresh = findElement(result, 'AutoRefresh');
        expect(autoRefresh?.props.channels).toBe(FootyChannel.Users);
    });

    it('renders an error message when listUsersAction throws', async () => {
        (listUsersAction as Mock).mockRejectedValue(new Error('DB failed'));

        const result = await Page();

        const html = renderToStaticMarkup(result);
        expect(html).toContain('Failed to fetch users.');
    });

    it('calls captureUnexpectedError when listUsersAction throws', async () => {
        const coreError = new Error('DB failed');
        (listUsersAction as Mock).mockRejectedValue(coreError);

        await Page();

        expect(captureUnexpectedError).toHaveBeenCalledWith(coreError, {
            layer: 'server',
            action: 'listUsersAction',
            component: 'AdminUserList',
            route: '/footy/admin/users',
        });
    });
});

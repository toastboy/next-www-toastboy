import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminUserList } from '@/components/AdminUserList/AdminUserList';
import type { UserWithRolePayload } from '@/lib/actions/auth';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultAdminUserDataPayload } from '@/tests/mocks/data/adminUserData';
import type { SetAdminRoleProxy } from '@/types/actions/SetAdminRole';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

const setAdminRoleMock = vi.fn<SetAdminRoleProxy>();

const users: UserWithRolePayload[] = [
    {
        ...defaultAdminUserDataPayload,
        id: 'admin-user-id',
        name: 'Adam Admin',
        email: 'adam.admin@example.com',
        role: 'admin',
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-06-20T12:00:00.000Z',
    },
    {
        ...defaultAdminUserDataPayload,
        id: 'victoria-user-id',
        name: 'Victoria User',
        email: 'victoria.user@example.com',
        role: 'user',
        createdAt: '2024-02-14T10:30:00.000Z',
        updatedAt: '2024-06-21T12:30:00.000Z',
    },
];

describe('AdminUserList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setAdminRoleMock.mockResolvedValue(undefined);
    });

    it('renders users in the table with search input', () => {
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        expect(screen.getByPlaceholderText('Search users')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'victoria.user@example.com' })).toBeInTheDocument();
    });

    it('filters users by name/email from the search input', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText('Search users'), 'victoria');

        expect(screen.queryByRole('link', { name: 'Adam Admin' })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Victoria User' })).toBeInTheDocument();
    });

    it('toggles name sort order when clicking the Name header', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const getFirstDataRow = () => screen.getAllByRole('row')[1];

        expect(within(getFirstDataRow()).getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();

        await user.click(screen.getByRole('columnheader', { name: /Name/ }));

        expect(within(getFirstDataRow()).getByRole('link', { name: 'Victoria User' })).toBeInTheDocument();
    });

    it('calls setAdminRole when toggling admin status', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const row = screen.getByRole('link', { name: 'Victoria User' }).closest('tr');
        expect(row).toBeTruthy();
        await user.click(within(row as HTMLElement).getByRole('switch'));

        await waitFor(() => {
            expect(setAdminRoleMock).toHaveBeenCalledWith('victoria-user-id', true);
        });
    });

    it('shows an error and captures unexpected errors when role update fails', async () => {
        const user = userEvent.setup();
        const error = new Error('set role failed');
        setAdminRoleMock.mockRejectedValueOnce(error);

        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const row = screen.getByRole('link', { name: 'Victoria User' }).closest('tr');
        expect(row).toBeTruthy();
        await user.click(within(row as HTMLElement).getByRole('switch'));

        await waitFor(() => {
            expect(screen.getByText('Failed to update admin status')).toBeInTheDocument();
        });
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            error,
            expect.objectContaining({
                layer: 'client',
                action: 'setAdminRoleAction',
                component: 'AdminUsersPage',
                route: '/footy/admin/users',
                extra: {
                    userId: 'victoria-user-id',
                    isAdmin: true,
                },
            }),
        );
    });
});

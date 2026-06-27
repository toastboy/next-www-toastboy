import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminUserList } from '@/components/AdminUserList/AdminUserList';
import type { UserWithRolePayload } from '@/lib/core/auth';
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

    it('renders no data rows for an empty users list', () => {
        render(
            <Wrapper>
                <AdminUserList users={[]} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        // Header row only — no data rows
        expect(screen.getAllByRole('row')).toHaveLength(1);
    });

    it('admin switch is checked for admin users and unchecked for non-admin users', () => {
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const adminSwitch = screen.getByRole('switch', { name: 'Toggle admin status for Adam Admin' });
        const userSwitch = screen.getByRole('switch', { name: 'Toggle admin status for Victoria User' });

        expect(adminSwitch).toBeChecked();
        expect(userSwitch).not.toBeChecked();
    });

    it('links point to the correct user admin page', () => {
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const adamLinks = screen.getAllByRole('link', { name: 'Adam Admin' });
        expect(adamLinks[0]).toHaveAttribute(
            'href',
            `/footy/admin/user/${encodeURIComponent('adam.admin@example.com')}`,
        );
    });

    it('filters users by email address', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText('Search users'), 'adam.admin');

        expect(screen.getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Victoria User' })).not.toBeInTheDocument();
    });

    it('sorts by Admin column (role) and shows sort icon', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        // Click once: ascending by role ('admin' < 'user' → Adam Admin first)
        await user.click(screen.getByRole('columnheader', { name: /Admin/ }));
        expect(within(screen.getAllByRole('row')[1]).getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();

        // Click again: descending → Victoria (user) first
        await user.click(screen.getByRole('columnheader', { name: /Admin/ }));
        expect(within(screen.getAllByRole('row')[1]).getByRole('link', { name: 'Victoria User' })).toBeInTheDocument();
    });

    it('sorts by Created column and shows sort icon', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        // Click once: ascending createdAt ('2024-01-10' < '2024-02-14' → Adam first)
        await user.click(screen.getByRole('columnheader', { name: /Created/ }));
        expect(within(screen.getAllByRole('row')[1]).getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();

        // Click again: descending → Victoria first
        await user.click(screen.getByRole('columnheader', { name: /Created/ }));
        expect(within(screen.getAllByRole('row')[1]).getByRole('link', { name: 'Victoria User' })).toBeInTheDocument();
    });

    it('sorts by email when the Email header is clicked', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        // Default sort is name asc → Adam first; switch to email sort
        await user.click(screen.getByRole('columnheader', { name: /Email/ }));

        // adam.admin@... < victoria.user@... alphabetically → Adam still first
        expect(within(screen.getAllByRole('row')[1]).getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();

        // Click again to reverse → Victoria first
        await user.click(screen.getByRole('columnheader', { name: /Email/ }));
        expect(within(screen.getAllByRole('row')[1]).getByRole('link', { name: 'Victoria User' })).toBeInTheDocument();
    });

    it('demotes an admin user when the admin switch is turned off', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const row = screen.getByRole('link', { name: 'Adam Admin' }).closest('tr');
        await user.click(within(row as HTMLElement).getByRole('switch'));

        await waitFor(() => {
            expect(setAdminRoleMock).toHaveBeenCalledWith('admin-user-id', false);
        });
    });

    it('reverses sort direction when clicking the same column header twice', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <AdminUserList users={users} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        const getFirstDataRow = () => screen.getAllByRole('row')[1];

        // First click: switch from default (name asc) to name desc
        await user.click(screen.getByRole('columnheader', { name: /Name/ }));
        expect(within(getFirstDataRow()).getByRole('link', { name: 'Victoria User' })).toBeInTheDocument();

        // Second click on same header: toggle back to name asc
        await user.click(screen.getByRole('columnheader', { name: /Name/ }));
        expect(within(getFirstDataRow()).getByRole('link', { name: 'Adam Admin' })).toBeInTheDocument();
    });

    it('renders an empty table when users is null', () => {
        render(
            <Wrapper>
                <AdminUserList users={null as unknown as UserWithRolePayload[]} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        // Header row only — no data rows
        expect(screen.getAllByRole('row')).toHaveLength(1);
    });

    it('uses email in aria-label when user name is an empty string', () => {
        const namelessUser: UserWithRolePayload = {
            ...defaultAdminUserDataPayload,
            id: 'nameless-user-id',
            name: '',
            email: 'nameless@example.com',
            role: 'user',
        };
        render(
            <Wrapper>
                <AdminUserList users={[namelessUser]} setAdminRole={setAdminRoleMock} />
            </Wrapper>,
        );

        expect(screen.getByRole('switch', {
            name: 'Toggle admin status for nameless@example.com',
        })).toBeInTheDocument();
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

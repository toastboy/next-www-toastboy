'use server';

import { Container, Text } from '@mantine/core';

import { listUsersAction, setAdminRoleAction } from '@/actions/auth';
import { AdminUserList } from '@/components/AdminUserList/AdminUserList';
import { UserWithRolePayload } from '@/lib/actions/auth';
import { toPublicMessage } from '@/lib/errors/AppError';
import { captureUnexpectedError } from '@/lib/observability/sentry';

export default async function Page() {
    let users: UserWithRolePayload[] = [];

    try {
        users = await listUsersAction();
    } catch (error) {
        captureUnexpectedError(error, {
            layer: 'server',
            action: 'listUsersAction',
            component: 'AdminUserList',
            route: '/footy/admin/users',
        });
        return (
            <Container>
                <Text c="red">{toPublicMessage(error, 'Failed to fetch users.')}</Text>
            </Container>
        );
    }

    return (
        <AdminUserList users={users} setAdminRole={setAdminRoleAction} />
    );
}

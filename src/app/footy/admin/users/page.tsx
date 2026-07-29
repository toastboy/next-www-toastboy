import {
    Center,
    Container,
    Text,
    Title,
} from '@mantine/core';

import { listUsersAction, setAdminRoleAction } from '@/actions/auth';
import { AdminUserList } from '@/components/AdminUserList/AdminUserList';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { UserWithRolePayload } from '@/lib/core/auth';
import { toPublicMessage } from '@/lib/errors/AppError';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Admin: Users' };

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
        <Container size="md" mt="xl">
            <AutoRefresh channels={FootyChannel.Users} />
            <Center>
                <Title order={2} mb="md">
                    Admin: Users
                </Title>
            </Center>
            <AdminUserList users={users} setAdminRole={setAdminRoleAction} />
        </Container>
    );
}

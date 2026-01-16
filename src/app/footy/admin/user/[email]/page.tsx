'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Center, Container, Text, Title } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { use, useEffect, useState } from 'react';

import type { UserWithRolePayload } from '@/actions/auth';
import { listUsersAction } from '@/actions/auth';

interface PageProps {
    params: Promise<{ email: string }>,
}

const Page: React.FC<PageProps> = (props) => {
    const { email } = use(props.params);

    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await listUsersAction(decodeURIComponent(email));
                setUsers(response.map((user: UserWithRolePayload) => ({
                    ...user,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt),
                    banExpires: user.banExpires ? new Date(user.banExpires) : null,
                })));
            }
            catch (error) {
                Sentry.captureMessage(`Error fetching users: ${String(error)}`, 'error');
                setErrorMessage('An error occurred while fetching users');
            }
        };

        // Errors are handled inside fetchUsers
        void fetchUsers();
    }, [email]);

    const user = users?.[0];

    if (errorMessage || !user) {
        return (
            <Container>
                <Text c="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <Container size="xs" mt="xl">
            <Center>
                <Title order={2} mb="md">
                    {user.name}
                </Title>
            </Center>

            <CodeHighlight
                code={JSON.stringify(user, null, 2)}
                language="json"
            />
        </Container>
    );
};

export default Page;

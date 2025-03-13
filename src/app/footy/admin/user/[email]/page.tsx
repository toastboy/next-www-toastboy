'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Center, Container, Loader, Text, Title } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { use, useEffect, useState } from 'react';
import { authClient } from 'src/lib/auth-client';

interface Props {
    params: Promise<{ email: string }>,
}

const Page: React.FC<Props> = (props) => {
    const { email } = use(props.params);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authClient.admin.listUsers({
                    query: {
                        searchField: "email",
                        searchOperator: "contains",
                        searchValue: decodeURIComponent(email),
                    },
                });

                if ('data' in response && response.data) {
                    setUsers(response.data?.users || []);
                } else {
                    setErrorMessage(response.error.message || 'An error occurred while fetching users');
                }
            } catch (error) {
                Sentry.captureMessage(`Error fetching users: ${error}`, 'error');
                setErrorMessage('An error occurred while fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [email]);

    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

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

            <CodeHighlight code={JSON.stringify(user, null, 2)} language="json" />
        </Container>
    );
};

export default Page;

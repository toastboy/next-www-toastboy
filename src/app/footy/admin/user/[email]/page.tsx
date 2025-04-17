'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Center, Container, Loader, Text, Title } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins/admin';
import MustBeAdmin from 'components/MustBeAdmin/MustBeAdmin';
import { authClient } from 'lib/authClient';
import { use, useEffect, useState } from 'react';

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
                setUsers(await authClient.listUsers(decodeURIComponent(email)));
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
        <MustBeAdmin>
            <Container size="xs" mt="xl">
                <Center>
                    <Title order={2} mb="md">
                        {user.name}
                    </Title>
                </Center>

                <CodeHighlight code={JSON.stringify(user, null, 2)} language="json" />
            </Container>
        </MustBeAdmin>
    );
};

export default Page;

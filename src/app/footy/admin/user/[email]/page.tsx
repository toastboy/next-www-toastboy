'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Center, Container, Text, Title } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { MustBeLoggedIn } from 'components/MustBeLoggedIn/MustBeLoggedIn';
import { authClient } from 'lib/authClient';
import { use, useEffect, useState } from 'react';

interface Props {
    params: Promise<{ email: string }>,
}

const Page: React.FC<Props> = (props) => {
    const { email } = use(props.params);

    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (isAllowed) {
                    setUsers(await authClient.listUsers(decodeURIComponent(email)));
                }
            }
            catch (error) {
                Sentry.captureMessage(`Error fetching users: ${String(error)}`, 'error');
                setErrorMessage('An error occurred while fetching users');
            }
        };

        // Errors are handled inside fetchUsers
        void fetchUsers();
    }, [email, isAllowed]);

    const user = users?.[0];

    if (errorMessage || !user) {
        return (
            <Container>
                <Text c="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <MustBeLoggedIn admin={true} onValidationChange={setIsAllowed}>
            <Container size="xs" mt="xl">
                <Center>
                    <Title order={2} mb="md">
                        {user.name}
                    </Title>
                </Center>

                <CodeHighlight code={JSON.stringify(user, null, 2)} language="json" />
            </Container>
        </MustBeLoggedIn>
    );
};

export default Page;

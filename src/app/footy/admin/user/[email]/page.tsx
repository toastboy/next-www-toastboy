'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Container, Loader, Text } from '@mantine/core';
import * as Sentry from '@sentry/react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { use, useEffect, useState } from 'react';
import { authClient } from 'src/lib/auth-client';

interface PageProps {
    params: Promise<{ email: string }>,
}

const Page: React.FC<PageProps> = (props) => {
    const { email } = use(props.params);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<keyof UserWithRole | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
    }, []);

    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (errorMessage) {
        return (
            <Container>
                <Text color="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <CodeHighlight code={JSON.stringify(users, null, 2)} language="json" />
    );
}

export default Page;

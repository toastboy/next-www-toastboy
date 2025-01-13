'use client';

import { Container, Loader, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { authClient } from 'src/lib/auth-client';

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<{ email: string }[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authClient.admin.listUsers({
                    query: {
                        limit: 10,
                    },
                });

                if ('data' in response && response.data) {
                    setUsers(response.data?.users || []);
                } else {
                    setErrorMessage(response.error.message || 'An error occurred while fetching users');
                }
            } catch (error) {
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
        <Container>
            {users?.length ? (
                users.map((user) => <Text key={user.email}>{user.email}</Text>)
            ) : (
                <Text>No users found</Text>
            )}
        </Container>
    );
}
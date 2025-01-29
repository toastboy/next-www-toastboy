'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Anchor, Box, Button, Center, Container, Group, Loader, Notification, PasswordInput, Stack, Switch, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconX } from '@tabler/icons-react';
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

    const form = useForm({
        initialValues: {
            "admin": false,
            "banned": null,
            "banReason": null,
            "banExpires": null,
        },

        validate: {
        },
    });

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
                <Text color="red">{errorMessage}</Text>
            </Container>
        );
    }

    form.values.admin = user.role == 'admin';

    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >
                    {user.name}
                </Title>
            </Center>

            <Box
                component="form"
            // onSubmit={form.onSubmit(handleSignUp)}
            >
                <Stack>
                    <Switch
                        label="Admin"
                        {...form.getInputProps('admin')}
                    />
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="Enter your email"
                        // icon={< IconAt size={16} />}
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder="Enter your password"
                        // icon={< IconLock size={16} />}
                        {...form.getInputProps('password')}
                    />
                    {
                        errorMessage && (
                            <Notification
                                icon={<IconX size={18} />}
                                color="red"
                                onClose={() => setErrorMessage(null)
                                }
                            >
                                {errorMessage}
                            </Notification>
                        )}
                    <Group mt="sm" >
                        <Anchor href="/auth/reset-password" size="sm" >
                            Forgot your password ?
                        </Anchor>
                    </Group>
                    < Button type="submit" fullWidth loading={loading} >
                        Sign Up
                    </Button>
                </Stack>
            </Box>
            <CodeHighlight code={JSON.stringify(user, null, 2)} language="json" />
        </Container>
    );
};

export default Page;

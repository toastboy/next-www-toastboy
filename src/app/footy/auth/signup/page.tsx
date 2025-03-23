'use client';

import { Anchor, Box, Button, Center, Container, Group, Notification, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconAt, IconIdBadge, IconLock, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { authClient } from "src/lib/auth-client";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },

        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email format',
            password: (value) =>
                value.length >= 8 ? null : 'Password must be at least 8 characters long',
        },
    });

    const handleSignUp = async (values: { name: string, email: string; password: string }) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const result = await authClient.signUp.email({
                // redirect: false, // Disable automatic redirection
                name: values.name,
                email: values.email,
                password: values.password,
                playerId: 12, // TODO: Replace with actual player ID
            }, {
                onRequest: () => {
                    //show loading
                },
                onSuccess: () => {
                    //redirect to the dashboard
                },
                onError: (ctx) => {
                    alert(ctx.error.message);
                },
            });

            Sentry.captureMessage(`Sign up result: ${result}`, 'info');
        } catch (error) {
            Sentry.captureMessage(`Sign in error: ${error}`, 'error');
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >
                    Sign up for your account
                </Title>
            </Center>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSignUp)}
            >
                <Stack>
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Enter your name"
                        rightSection={<IconIdBadge size={16} />}
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        withAsterisk
                        label="Email"
                        placeholder="Enter your email"
                        rightSection={<IconAt size={16} />}
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder="Enter your password"
                        rightSection={<IconLock size={16} />}
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
        </Container>
    );
}

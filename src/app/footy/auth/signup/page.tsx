'use client';

import { Anchor, Box, Button, Container, Group, Notification, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconAt, IconIdBadge, IconLock, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { authClient } from "src/lib/auth-client";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [signupError, setSignupError] = useState<boolean>(false);

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
        setSignupError(false);

        try {
            const result = await authClient.signUp.email({
                // redirect: false, // Disable automatic redirection
                name: values.name,
                email: values.email,
                password: values.password,
                playerId: 12, // TODO: Replace with actual player ID
            }, {
                onRequest: () => {
                    // TODO: show loading
                },
                onSuccess: () => {
                    // TODO: redirect to the dashboard
                },
                onError: (ctx) => {
                    alert(ctx.error.message);
                },
            });

            Sentry.captureMessage(`Sign up result: ${JSON.stringify(result)}`, 'info');
        } catch (error) {
            Sentry.captureMessage(`Sign in error: ${String(error)}`, 'error');
            setSignupError(true);
        } finally {
            setLoading(false);
        }
    };

    const errorNotification = signupError ? (
        <Notification
            icon={<IconX size={18} />}
            color="red"
            onClose={() => setSignupError(false)}
        >
            Something went wrong. Please try again.
        </Notification>
    ) : null;

    return (
        <Container size="xs" mt="xl" >
            <Stack>
                <Title order={2} mb="md" >
                    Sign up for your account
                </Title>
                <Text mb="lg">If you already have a player profile, you can add a login for each of your email addresses</Text>
            </Stack>

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
                    {errorNotification}
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

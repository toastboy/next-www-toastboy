'use client';

import { Anchor, Box, Button, Center, Container, Group, Loader, Notification, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconAt, IconLock, IconX } from '@tabler/icons-react';
import { authClient } from 'lib/authClient';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signInWithGoogle, signInWithMicrosoft } from "src/lib/auth-client";

export interface Props {
    admin?: boolean;
    redirect?: string;
};

export const SignIn: React.FC<Props> = ({ admin, redirect }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
        initialValues: {
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

    const handleSignIn = async (values: { email: string; password: string }) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            await authClient.signInWithEmail(values.email, values.password);
            router.push(redirect || pathname);
        } catch (error) {
            Sentry.captureMessage(`Sign in error: ${JSON.stringify(error, null, 2)}`, 'error');
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    let title = <Text data-testid="sign-in">
        Sign in to your account
    </Text>;

    if (admin === true) {
        title = <Text data-testid="must-be-admin">
            You must be logged in as an administrator to use this page.
        </Text>;
    } else if (admin === false) {
        title = <Text data-testid="must-be-logged-in">
            You must be logged in to use this page.
        </Text>;
    }

    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >                    {title}
                </Title>
            </Center>

            <Button onClick={() => signInWithGoogle(redirect || pathname)}>Sign in with Google</Button>

            <Button onClick={() => signInWithMicrosoft(redirect || pathname)}>Sign in with Microsoft</Button>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSignIn)}
            >
                <Stack>
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
                    <Button type="submit" fullWidth loading={loading} >
                        Sign In
                    </Button>
                </Stack>
            </Box>
        </Container >
    );
};

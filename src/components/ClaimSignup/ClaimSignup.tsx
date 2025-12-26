'use client';

import { Box, Button, Container, Divider, Notification, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconAt, IconIdBadge, IconLock, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth-client';

interface ClaimSignupProps {
    name: string
    email: string;
    redirect: string;
}

export const ClaimSignup = ({ name, email, redirect }: ClaimSignupProps) => {
    const [loading, setLoading] = useState(false);
    const [signupError, setSignupError] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm({
        initialValues: {
            name,
            email,
            password: '',
        },

        validate: {
            // TODO: Use zod validation schema
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email format',
            password: (value) =>
                value.length >= 8 ? null : 'Password must be at least 8 characters long',
        },
    });

    const handleSignUp = async (values: { name: string; email: string; password: string }) => {
        setLoading(true);
        setSignupError(false);

        try {
            await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
            }, {
                onError: (ctx) => {
                    alert(ctx.error.message);
                },
            });

            router.push(redirect);
        } catch (error) {
            Sentry.captureMessage(`Sign up error: ${String(error)}`, 'error');
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
                    Finish creating your login
                </Title>
                <Text mb="lg">
                    Your email address &quot;{email}&quot; has been verified. Choose how you want to sign in.
                </Text>
            </Stack>

            <Stack mb="lg">
                <Button variant="default" onClick={() => signInWithGoogle(redirect)}>
                    Continue with Google
                </Button>
                <Button variant="default" onClick={() => signInWithMicrosoft(redirect)}>
                    Continue with Microsoft
                </Button>
                <Divider label="or" labelPosition="center" />
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
                        readOnly
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
                    <Button type="submit" fullWidth loading={loading} >
                        Create login
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

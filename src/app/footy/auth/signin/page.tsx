'use client';

import {
    Anchor,
    Box,
    Button,
    Center,
    Container,
    Group,
    Notification,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { authClient } from "src/lib/auth-client";

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            const result = await authClient.signIn.email({
                // redirect: false, // Disable automatic redirection
                email: values.email,
                password: values.password,
            }, {
                onRequest: (ctx) => {
                    //show loading
                },
                onSuccess: (ctx) => {
                    //redirect to the dashboard
                },
                onError: (ctx) => {
                    alert("Error " + ctx.error.message);
                },
            });
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >
                    Sign in to your account
                </Title>
            </Center>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSignIn)}
            >
                <Stack>
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
                        Sign In
                    </Button>
                </Stack>
            </Box>
            <Text mt="md" >
                Don't have an account?{' '}
                <Anchor href="/footy/signup" size="sm" >
                    Sign up
                </Anchor>
            </Text>
        </Container>
    );
}

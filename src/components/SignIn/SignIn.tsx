'use client';

import {
    Anchor,
    Box,
    Button,
    Center,
    Container,
    Divider,
    Group,
    Loader,
    Notification,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconAt, IconLock, IconX } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { signInWithGoogle, signInWithMicrosoft } from '@/lib/auth-client';
import { authClient } from '@/lib/authClient';
import { getPublicBaseUrl } from '@/lib/urls';

export interface Props {
    admin?: boolean;
    redirect?: string;
};

export const SignIn: React.FC<Props> = ({ admin, redirect }) => {
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const redirectPath = redirect ?? pathname;
    const socialRedirect = new URL(redirectPath, getPublicBaseUrl()).toString();
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
        setLoginError(false);

        try {
            await authClient.signInWithEmail(values.email, values.password);
            router.push(redirectPath);
        }
        catch (error) {
            Sentry.captureMessage(`Sign in error: ${JSON.stringify(error, null, 2)}`, 'error');
            setLoginError(true);
        }
        finally {
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

    const errorNotification = loginError ? (
        <Notification
            icon={<IconX size={18} />}
            color="red"
            onClose={() => setLoginError(false)}
        >
            Login failed. Please check your details and try again.
        </Notification>
    ) : null;

    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >
                    {title}
                </Title>
            </Center>

            <Stack mb="lg">
                <Button variant="default" onClick={() => signInWithGoogle(socialRedirect)}>
                    Sign in with Google
                </Button>
                <Button variant="default" onClick={() => signInWithMicrosoft(socialRedirect)}>
                    Sign in with Microsoft
                </Button>
                <Divider label="or" labelPosition="center" />
            </Stack>

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
                        value={form.values.email ?? ''}

                    />
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder="Enter your password"
                        rightSection={<IconLock size={16} />}
                        {...form.getInputProps('password')}
                        value={form.values.password ?? ''}

                    />
                    {errorNotification}
                    <Group mt="sm">
                        <Anchor href="/footy/forgottenpassword" size="sm">
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

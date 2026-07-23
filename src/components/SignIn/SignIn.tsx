'use client';

import {
    Anchor,
    Box,
    Button,
    Center,
    Container,
    Divider,
    Group,
    Image,
    Loader,
    Notification,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconLock, IconX } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth.client';
import { config } from '@/lib/config';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { getPublicBaseUrl } from '@/lib/urls';

export interface Props {
    admin?: boolean;
    redirect?: string;
};

export const SignIn = ({ admin, redirect }: Props) => {
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
            await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });
            router.push(redirectPath);
        }
        catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                action: 'signInWithEmail',
                component: 'SignIn',
                route: pathname,
                extra: {
                    redirectPath,
                },
            });
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

    let title = (
        <Text>
            Sign in to your account
        </Text>
    );

    if (admin === true) {
        title = (
            <Text>
                You must be logged in as an administrator to use this page.
            </Text>
        );
    } else if (admin === false) {
        title = (
            <Text>
                You must be logged in to use this page.
            </Text>
        );
    }

    const errorNotification = loginError ? (
        <Notification
            icon={<IconX size={config.notificationIconSize} />}
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
                <UnstyledButton
                    onClick={() => signInWithGoogle(socialRedirect)}
                    w="fit-content"
                >
                    <Image src="/google-signin-button-light.svg" alt="Sign in with Google" w={180} h={40} />
                </UnstyledButton>
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
                        value={form.values.email}

                    />
                    <PasswordInput
                        withAsterisk
                        label="Password"
                        placeholder="Enter your password"
                        rightSection={<IconLock size={16} />}
                        {...form.getInputProps('password')}
                        value={form.values.password}

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

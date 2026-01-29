'use client';

import {
    Box,
    Button,
    Container,
    Divider,
    Notification,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth.client';
import { config } from '@/lib/config';
import { getPublicBaseUrl } from '@/lib/urls';

export interface Props {
    name: string
    email: string;
    token: string;
}

const ClaimSignupSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const ClaimSignup = ({ name, email, token }: Props) => {
    const [loading, setLoading] = useState(false);
    const [signupError, setSignupError] = useState<boolean>(false);
    const router = useRouter();
    const redirectPath = `/api/footy/auth/claim/${encodeURIComponent(token)}?redirect=/footy/profile`;
    const socialRedirect = new URL(redirectPath, getPublicBaseUrl()).toString();

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: zod4Resolver(ClaimSignupSchema),
        validateInputOnBlur: true,
    });

    const handleSignUp = async (values: z.infer<typeof ClaimSignupSchema>) => {
        setLoading(true);
        setSignupError(false);

        try {
            await authClient.signUp.email({
                name: name,
                email: email,
                password: values.password,
            }, {
                onError: (ctx) => {
                    alert(ctx.error.message);
                },
            });

            router.push(redirectPath);
        } catch (error) {
            Sentry.captureMessage(`Sign up error: ${String(error)}`, 'error');
            setSignupError(true);
        } finally {
            setLoading(false);
        }
    };

    const errorNotification = signupError ? (
        <Notification
            icon={<IconX size={config.notificationIconSize} />}
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
                <Button
                    data-testid="google-signin-button"
                    variant="default" onClick={() => signInWithGoogle(socialRedirect)}
                >
                    Continue with Google
                </Button>
                <Button
                    data-testid="microsoft-signin-button"
                    variant="default" onClick={() => signInWithMicrosoft(socialRedirect)}
                >
                    Continue with Microsoft
                </Button>
                <Divider
                    label="or"
                    labelPosition="center"
                />
            </Stack>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSignUp)}
            >
                <Stack>
                    <PasswordFields
                        passwordProps={form.getInputProps('password')}
                        confirmPasswordProps={form.getInputProps('confirmPassword')}
                    />
                    {errorNotification}
                    <Button
                        data-testid="submit-button"
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        Create login
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

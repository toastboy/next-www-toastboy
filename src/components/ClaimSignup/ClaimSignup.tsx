'use client';

import {
    Anchor,
    Box,
    Button,
    Container,
    Divider,
    Group,
    Image,
    Notification,
    Stack,
    Text,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth.client';
import { config } from '@/lib/config';
import { captureUnexpectedError } from '@/lib/observability/sentry';
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
    const [signupError, setSignupError] = useState<string | undefined>(undefined);
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
        setSignupError(undefined);

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
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                action: 'signUpWithEmail',
                component: 'ClaimSignup',
                route: '/claim-signup',
                extra: {
                    redirectPath,
                },
            });
            setSignupError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validatedEmail = z.email().safeParse(email);
    const invitationError = !email || !name || !token || !validatedEmail.success ?
        'Missing or invalid invitation details.' : undefined;

    if (invitationError) {
        return (
            <Container size="xs" mt="xl">
                <Stack>
                    <Notification
                        icon={<IconX size={config.notificationIconSize} />}
                        color="red"
                        withCloseButton={false}
                    >
                        {invitationError}
                    </Notification>
                    <Text ta="center">
                        <Anchor href="/footy">Return to the home page</Anchor>
                    </Text>
                </Stack>
            </Container>
        );
    }

    const errorNotification = signupError ? (
        <Notification
            icon={<IconX size={config.notificationIconSize} />}
            color="red"
            onClose={() => setSignupError(undefined)}
        >
            {signupError}
        </Notification>
    ) : null;

    return (
        <Container size="xs" mt="xl" >
            <Stack mb="lg">
                <Title order={2} mb="xs" w="100%" ta="center">
                    Finish creating your login
                </Title>
                <Text ta="center">
                    Your email address &quot;{email}&quot; has been verified. Choose how you want to sign in.
                </Text>
                <Divider mb="xs" />
                <Group justify="center" w="100%" mb="md">
                    <UnstyledButton
                        onClick={() => signInWithGoogle(socialRedirect)}
                        w="fit-content"
                        type="button"
                    >
                        <Image src="/google-signin-button-light.svg" alt="Sign in with Google" w={180} h={40} />
                    </UnstyledButton>
                    <UnstyledButton
                        onClick={() => signInWithMicrosoft(socialRedirect)}
                        w="fit-content"
                        type="button"
                    >
                        <Image src="/microsoft-signin-button-light.svg" alt="Sign in with Microsoft" w={215} h={41} />
                    </UnstyledButton>
                </Group>
                <Divider label="or" labelPosition="center" />
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
                        type="submit"
                        fullWidth
                        loading={loading}
                        disabled={!form.isValid()}
                    >
                        Create login
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

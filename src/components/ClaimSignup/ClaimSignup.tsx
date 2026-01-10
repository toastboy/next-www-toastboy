'use client';

import {
    Box,
    Button,
    Container,
    Divider,
    Notification,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import * as Sentry from '@sentry/react';
import { IconAt, IconIdBadge, IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth-client';
import { getPublicBaseUrl } from '@/lib/urls';

export interface Props {
    name: string
    email: string;
    token: string;
}

const ClaimSignupSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email({ message: 'Invalid email format' }),
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
    const redirectPath = `/footy/auth/claim/complete?token=${encodeURIComponent(token)}`;
    const socialRedirect = new URL(redirectPath, getPublicBaseUrl()).toString();

    const form = useForm({
        initialValues: {
            name,
            email,
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
                name: values.name,
                email: values.email,
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
                <Button variant="default" onClick={() => signInWithGoogle(socialRedirect)}>
                    Continue with Google
                </Button>
                <Button variant="default" onClick={() => signInWithMicrosoft(socialRedirect)}>
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
                        description="This is the name that will be displayed on your profile if you use password login. If you sign in with Google or Microsoft, your profile name will come from your Google or Microsoft account."
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
                        disabled
                        {...form.getInputProps('email')}
                    />
                    <PasswordFields
                        passwordProps={form.getInputProps('password')}
                        confirmPasswordProps={form.getInputProps('confirmPassword')}
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

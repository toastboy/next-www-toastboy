'use client';

import { Box, Button, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { authClient } from '@/lib/auth-client';
import { getPublicBaseUrl } from '@/lib/urls';

const PasswordResetSchema = z.object({
    email: z.preprocess(
        (value) => {
            return typeof value === 'string' ? value.trim().toLowerCase() : value;
        },
        z.union([
            z.email({ message: 'Invalid email' }),
            z.literal(''),
        ]),
    ),
});

export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;

type PageProps = object

const Page: React.FC<PageProps> = () => {
    const form = useForm<PasswordResetInput>({
        initialValues: {
            email: '',
        } satisfies PasswordResetInput,
        validate: zod4Resolver(PasswordResetSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (
        values: typeof form.values,
    ) => {
        const id = notifications.show({
            loading: true,
            title: 'Requesting password reset',
            message: 'Checking for your account...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const { status, message } = await authClient.requestPasswordReset({
                email: values.email,
                redirectTo: new URL('/reset-password', getPublicBaseUrl()).toString(),
            });

            notifications.update({
                id,
                color: 'teal',
                title: 'Check your email',
                message: 'If that email is linked to an account, a reset link is on the way.',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Failed to send reset password email:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
                icon: <IconAlertTriangle size={18} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    return (
        <Box
            maw={400}
            component="form"
            onSubmit={form.onSubmit(handleSubmit)}
        >
            <EmailInput
                label="Email"
                required
                {...form.getInputProps(`email`)}
            />

            <Text size="sm" c="dimmed" mt="xs">
                If the email is associated with an account, you&apos;ll receive a reset link.
            </Text>

            <Button type="submit" mt="md">
                Submit
            </Button>
        </Box>
    );
};

export default Page;

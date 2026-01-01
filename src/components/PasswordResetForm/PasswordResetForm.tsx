'use client';

import {
    Box,
    Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import z from 'zod';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { authClient } from '@/lib/auth-client';
import { getPublicBaseUrl } from '@/lib/urls';

export type Props = unknown;

/**
 * Validate a normalized email value for password reset and emit clear messages.
 */
const validatePasswordResetEmail = (value: string, ctx: z.RefinementCtx) => {
    if (!value) {
        ctx.addIssue({
            code: 'custom',
            message: 'Email is required',
        });
        return;
    }

    if (!z.email().safeParse(value).success) {
        ctx.addIssue({
            code: 'custom',
            message: 'Invalid email',
        });
    }
};

const PasswordResetSchema = z.object({
    email: z.preprocess(
        (value) => {
            return typeof value === 'string' ? value.trim().toLowerCase() : value;
        },
        z.string().superRefine(validatePasswordResetEmail),
    ),
});

export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;

export const PasswordResetForm: React.FC<Props> = () => {
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
                redirectTo: new URL('/footy/auth/reset-password', getPublicBaseUrl()).toString(),
            });

            if (!status) console.error('Failed to send reset password email:', message);

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
            noValidate
        >
            <EmailInput
                label="Email"
                description={[
                    "If the email is associated with an account, you'll receive a reset link.",
                    "Note that if you use Google or Microsoft sign-in, you won't have a password to reset.",
                ].join(' ')}
                required
                {...form.getInputProps(`email`)}
            />

            <Button type="submit" mt="md">
                Submit
            </Button>
        </Box>
    );
};

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
import { authClient } from '@/lib/auth.client';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { getPublicBaseUrl } from '@/lib/urls';

export type Props = unknown;

/**
 * Validate a normalized email value for password reset and emit clear messages.
 */
const validateForgottenPasswordEmail = (value: string, ctx: z.RefinementCtx) => {
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

const ForgottenPasswordSchema = z.object({
    email: z.preprocess(
        (value) => {
            return typeof value === 'string' ? value.trim().toLowerCase() : value;
        },
        z.string().superRefine(validateForgottenPasswordEmail),
    ),
});

export type ForgottenPasswordInput = z.infer<typeof ForgottenPasswordSchema>;

export const ForgottenPasswordForm: React.FC<Props> = () => {
    const form = useForm<ForgottenPasswordInput>({
        initialValues: {
            email: '',
        } satisfies ForgottenPasswordInput,
        validate: zod4Resolver(ForgottenPasswordSchema),
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
            await authClient.requestPasswordReset({
                email: values.email,
                redirectTo: new URL('/footy/auth/reset-password', getPublicBaseUrl()).toString(),
            });

            notifications.update({
                id,
                color: 'teal',
                title: 'Check your email',
                message: 'If that email is linked to an account, a reset link is on the way.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'ForgottenPasswordForm',
                action: 'requestPasswordReset',
                route: '/footy/forgottenpassword',
                extra: {
                    email: values.email,
                },
            });
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: toPublicMessage(err, 'Unable to request a password reset right now.'),
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
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

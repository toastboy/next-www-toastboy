'use client';

import {
    Box,
    Button,
    Container,
    Notification,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { authClient } from '@/lib/auth-client';

export interface Props {
    token: string;
}

/**
 * Validate the password reset inputs for length and confirmation.
 */
const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Render the password reset flow for a user who has a reset token.
 */
export const PasswordResetForm: React.FC<Props> = ({ token }) => {
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: zod4Resolver(resetPasswordSchema),
        validateInputOnBlur: true,
    });

    /**
     * Submit a new password for the provided reset token and surface status via notifications.
     */
    const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        const id = notifications.show({
            loading: true,
            title: 'Resetting password',
            message: 'Updating your password...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const { status } = await authClient.resetPassword({
                newPassword: values.password,
                token,
            });

            if (!status) {
                throw new Error('Unable to reset password.');
            }

            notifications.update({
                id,
                color: 'teal',
                title: 'Password updated',
                message: 'Your password has been reset successfully.',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to reset password.';
            console.error('Failed to reset password:', error);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
                icon: <IconX size={18} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    if (!token) {
        return (
            <Container size="xs" mt="xl">
                <Notification icon={<IconX size={18} />} color="red">
                    <Text>Password reset link is missing or invalid.</Text>
                </Notification>
            </Container>
        );
    }

    return (
        <Container size="xs" mt="xl">
            <Stack>
                <Title order={2} mb="md">
                    Reset your password
                </Title>
                <Text mb="lg">
                    Enter a new password for your account.
                </Text>
            </Stack>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                noValidate
            >
                <Stack>
                    <PasswordFields
                        passwordLabel="New password"
                        confirmPasswordLabel="Confirm new password"
                        passwordPlaceholder="Enter a new password"
                        confirmPasswordPlaceholder="Re-enter your new password"
                        passwordProps={form.getInputProps('password')}
                        confirmPasswordProps={form.getInputProps('confirmPassword')}
                    />
                    <Button type="submit" fullWidth>
                        Reset password
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

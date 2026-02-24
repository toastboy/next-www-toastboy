'use client';

import {
    Anchor,
    Box,
    Button,
    Container,
    Notification,
    PasswordInput,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconLock, IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { z } from 'zod';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { authClient } from '@/lib/auth.client';
import { config } from '@/lib/config';

export interface Props {
    revokeOtherSessions?: boolean;
}

/**
 * Validate the password change inputs for presence, length, and confirmation.
 */
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Render the password change flow for a logged-in user.
 */
export const PasswordChangeForm: React.FC<Props> = ({ revokeOtherSessions }) => {
    const [errorText, setErrorText] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const form = useForm<z.infer<typeof changePasswordSchema>>({
        initialValues: {
            currentPassword: '',
            password: '',
            confirmPassword: '',
        },
        validate: zod4Resolver(changePasswordSchema),
        validateInputOnBlur: true,
    });

    /**
     * Submit the current and new password and surface status via notifications.
     */
    const handleSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
        try {
            setErrorText(null);
            setSuccess(false);

            await authClient.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.password,
                revokeOtherSessions,
            });

            form.reset();
            setSuccess(true);
        } catch (error) {
            const message =
                (error as { error?: { message?: string } }).error?.message ??
                (error as { message?: string }).message;
            setErrorText(message ?? 'An unexpected error occurred. Please try again.');
        }
    };

    const notification = success ? (
        <Notification
            data-testid="success-notification"
            icon={<IconCheck size={config.notificationIconSize} />}
            color="green"
        >
            Your password has been updated successfully.
        </Notification>
    ) : (errorText ? (
        <Notification
            data-testid="error-notification"
            icon={<IconX size={config.notificationIconSize} />}
            color="red"
            onClose={() => setErrorText(null)}
        >
            {errorText}. Please try again, or use the&nbsp;
            <Anchor href="/footy/forgottenpassword">forgotten password form</Anchor>.
        </Notification>
    ) : null);

    return (
        <Container size="xs" mt="xl">
            <Stack>
                <Title order={2} mb="md">
                    Change your password
                </Title>
                <Text mb="lg">
                    Enter your current password and choose a new one.
                </Text>
            </Stack>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                noValidate
            >
                <Stack>
                    <PasswordInput
                        withAsterisk
                        data-testid="current-password-input"
                        label="Current password"
                        placeholder="Enter your current password"
                        rightSection={<IconLock size={16} />}
                        {...form.getInputProps('currentPassword')}
                    />
                    <PasswordFields
                        passwordLabel="New password"
                        confirmPasswordLabel="Confirm new password"
                        passwordPlaceholder="Enter a new password"
                        confirmPasswordPlaceholder="Re-enter your new password"
                        passwordProps={form.getInputProps('password')}
                        confirmPasswordProps={form.getInputProps('confirmPassword')}
                    />
                    {notification}
                    <Button
                        data-testid="submit-button"
                        type="submit"
                        fullWidth
                    >
                        Update password
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

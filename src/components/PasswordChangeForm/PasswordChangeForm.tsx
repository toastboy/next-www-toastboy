'use client';

import {
    Box,
    Button,
    Container,
    PasswordInput,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconLock, IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

import { PasswordFields } from '@/components/PasswordFields/PasswordFields';
import { authClient } from '@/lib/auth-client';

export interface Props {
    revokeOtherSessions?: boolean;
}

const resolveChangePasswordError = (error: unknown) => {
    if (error && typeof error === 'object') {
        const code = (error as { error?: { message?: string } }).error?.message;
        switch (code) {
            case 'INVALID_PASSWORD':
                return 'Current password is incorrect.';
            case 'CREDENTIAL_ACCOUNT_NOT_FOUND':
                return "This account doesn't have a password yet. Use the forgot password flow to set one.";
            case 'PASSWORD_TOO_SHORT':
                return 'Password must be at least 8 characters long.';
            case 'PASSWORD_TOO_LONG':
                return 'Password is too long.';
            default:
                break;
        }
    }
    return 'Unable to update password.';
};

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
        const id = notifications.show({
            loading: true,
            title: 'Updating password',
            message: 'Checking your current password...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await authClient.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.password,
                revokeOtherSessions,
            });

            notifications.update({
                id,
                color: 'teal',
                title: 'Password updated',
                message: 'Your password has been updated successfully.',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });

            form.reset();
        } catch (error) {
            const message = resolveChangePasswordError(error);
            console.error('Failed to change password:', error);
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
                    <Button type="submit" fullWidth>
                        Update password
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};

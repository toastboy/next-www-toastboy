'use client';

import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

export interface PasswordFieldsProps {
    passwordProps: PasswordInputProps;
    confirmPasswordProps: PasswordInputProps;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    passwordPlaceholder?: string;
    confirmPasswordPlaceholder?: string;
}

/**
 * Render a pair of password and confirm-password inputs with shared styling.
 */
export const PasswordFields: React.FC<PasswordFieldsProps> = ({
    passwordProps,
    confirmPasswordProps,
    passwordLabel = 'Password',
    confirmPasswordLabel = 'Confirm password',
    passwordPlaceholder = 'Enter your password',
    confirmPasswordPlaceholder = 'Re-enter your password',
}) => {
    return (
        <>
            <PasswordInput
                withAsterisk
                data-testid="password-input"
                label={passwordLabel}
                placeholder={passwordPlaceholder}
                rightSection={<IconLock size={16} />}
                {...passwordProps}
            />
            <PasswordInput
                withAsterisk
                data-testid="confirm-password-input"
                label={confirmPasswordLabel}
                placeholder={confirmPasswordPlaceholder}
                rightSection={<IconLock size={16} />}
                {...confirmPasswordProps}
            />
        </>
    );
};

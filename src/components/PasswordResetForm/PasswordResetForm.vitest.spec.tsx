import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { PasswordResetForm } from '@/components/PasswordResetForm/PasswordResetForm';
import { authClient } from '@/lib/auth.client';
import { Wrapper } from '@/tests/components/lib/common';

const mockResetPassword =
    authClient.resetPassword as MockedFunction<typeof authClient.resetPassword>;

describe('PasswordResetForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockResetPassword.mockResolvedValue({ status: true });
    });

    it('renders password fields and submit button', () => {
        render(
            <Wrapper>
                <PasswordResetForm token="token-123" />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/^New password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm new password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reset password/i })).toBeInTheDocument();
    });

    it('shows a notification when the token is missing', () => {
        render(
            <Wrapper>
                <PasswordResetForm token="" />
            </Wrapper>,
        );

        expect(screen.getByText(/Password reset link is missing or invalid/i)).toBeInTheDocument();
    });

    it('submits a new password and shows success notification', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <PasswordResetForm token="token-123" />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Reset password/i }));

        await waitFor(() => {
            expect(mockResetPassword).toHaveBeenCalledWith({
                newPassword: 'Password123',
                token: 'token-123',
            });
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Password updated',
                    message: 'Your password has been reset successfully.',
                }),
            );
        });
    });
});

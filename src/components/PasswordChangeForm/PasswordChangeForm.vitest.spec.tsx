import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { PasswordChangeForm } from '@/components/PasswordChangeForm/PasswordChangeForm';
import { authClient } from '@/lib/auth.client';
import { Wrapper } from '@/tests/components/lib/common';

const mockChangePassword =
    authClient.changePassword as MockedFunction<typeof authClient.changePassword>;

describe('PasswordChangeForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockChangePassword.mockResolvedValue({
            token: 'test-token',
            user: {
                id: 'test-user',
                email: 'tester@example.com',
                name: 'Tester',
                image: null,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                banned: undefined,
            },
        });
    });

    it('renders current and new password fields with a submit button', () => {
        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Current password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^New password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm new password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Update password/i })).toBeInTheDocument();
    });

    it('submits current and new password and shows success notification', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith({
                currentPassword: 'OldPassword123',
                newPassword: 'Password123',
                revokeOtherSessions: undefined,
            });
        });

        expect(
            screen.getByText('Your password has been updated successfully.'),
        ).toBeInTheDocument();
    });

    it('passes revokeOtherSessions prop to changePassword', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PasswordChangeForm revokeOtherSessions={true} />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(mockChangePassword).toHaveBeenCalledWith({
                currentPassword: 'OldPassword123',
                newPassword: 'Password123',
                revokeOtherSessions: true,
            });
        });
    });

    it('shows error notification with error.error.message on API failure', async () => {
        const user = userEvent.setup();
        mockChangePassword.mockRejectedValue({ error: { message: 'Incorrect current password' } });

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'WrongPassword');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText(/Incorrect current password/)).toBeInTheDocument();
    });

    it('shows error notification with error.message on API failure', async () => {
        const user = userEvent.setup();
        mockChangePassword.mockRejectedValue(new Error('Network error'));

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });

    it('shows fallback error message when error has no message', async () => {
        const user = userEvent.setup();
        mockChangePassword.mockRejectedValue({});

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    });

    it('dismisses the error notification when closed', async () => {
        const user = userEvent.setup();
        mockChangePassword.mockRejectedValue({ error: { message: 'Some error' } });

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        await user.click(within(screen.getByRole('alert')).getByRole('button'));

        await waitFor(() => {
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    it('does not submit when passwords do not match', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'DifferentPassword');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });

        expect(mockChangePassword).not.toHaveBeenCalled();
    });

    it('does not submit when new password is too short', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Current password/i), 'OldPassword123');
        await user.type(screen.getByLabelText(/^New password/i), 'short');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'short');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
        });

        expect(mockChangePassword).not.toHaveBeenCalled();
    });

    it('does not submit when current password is empty', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <PasswordChangeForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/^New password/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm new password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Update password/i }));

        await waitFor(() => {
            expect(screen.getByText('Current password is required')).toBeInTheDocument();
        });

        expect(mockChangePassword).not.toHaveBeenCalled();
    });
});

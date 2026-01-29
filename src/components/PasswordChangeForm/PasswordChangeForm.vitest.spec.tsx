import { render, screen, waitFor } from '@testing-library/react';
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
});

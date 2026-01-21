
import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { ForgottenPasswordForm } from '@/components/ForgottenPasswordForm/ForgottenPasswordForm';
import { authClient } from '@/lib/auth-client';
import { Wrapper } from '@/tests/components/lib/common';

const mockRequestPasswordReset =
    authClient.requestPasswordReset as MockedFunction<typeof authClient.requestPasswordReset>;

describe('ForgottenPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequestPasswordReset.mockResolvedValue({
            status: true,
        } as Awaited<ReturnType<typeof authClient.requestPasswordReset>>);
    });

    it('renders the form fields', () => {
        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('shows required validation when submitted empty', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Submit/i }));

        expect(await screen.findByText('Email is required')).toBeInTheDocument();
    });

    it('submits a valid email and shows success notification', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
        await user.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(mockRequestPasswordReset).toHaveBeenCalledWith({
                email: 'test@example.com',
                redirectTo: 'http://localhost/footy/auth/reset-password',
            });
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Check your email',
                    message: 'If that email is linked to an account, a reset link is on the way.',
                }),
            );
        });
    });
});

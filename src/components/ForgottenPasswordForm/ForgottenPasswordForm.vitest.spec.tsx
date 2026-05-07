
import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MockedFunction } from 'vitest';
import { vi } from 'vitest';

import { ForgottenPasswordForm } from '@/components/ForgottenPasswordForm/ForgottenPasswordForm';
import { authClient } from '@/lib/auth.client';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@/lib/errors', () => ({
    toPublicMessage: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

const mockRequestPasswordReset =
    authClient.requestPasswordReset as MockedFunction<typeof authClient.requestPasswordReset>;
const mockToPublicMessage = toPublicMessage as MockedFunction<typeof toPublicMessage>;
const mockCaptureUnexpectedError =
    captureUnexpectedError as MockedFunction<typeof captureUnexpectedError>;

describe('ForgottenPasswordForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequestPasswordReset.mockResolvedValue({
            status: true,
        } as Awaited<ReturnType<typeof authClient.requestPasswordReset>>);
        mockToPublicMessage.mockImplementation(
            (_error, fallback) => fallback ?? 'Unable to request a password reset right now.',
        );
    });

    it('renders the form fields', () => {
        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send reset link/i })).toBeInTheDocument();
    });

    it('shows required validation when submitted empty', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Send reset link/i }));

        expect(await screen.findByText('Email is required')).toBeInTheDocument();
    });

    it('shows invalid email validation for malformed addresses', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Email/i), 'not-an-email');
        await user.click(screen.getByRole('button', { name: /Send reset link/i }));

        expect(await screen.findByText('Invalid email')).toBeInTheDocument();
        expect(mockRequestPasswordReset).not.toHaveBeenCalled();
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
        await user.click(screen.getByRole('button', { name: /Send reset link/i }));

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

    it('accepts mixed-case email input and shows success feedback', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Email/i), 'TEST@Example.COM');
        await user.click(screen.getByRole('button', { name: /Send reset link/i }));

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

    it('captures submit failures and shows a public error notification', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        const submitFailure = new Error('reset failed');

        mockRequestPasswordReset.mockRejectedValue(submitFailure);
        mockToPublicMessage.mockReturnValue('Readable failure');

        render(
            <Wrapper>
                <ForgottenPasswordForm />
            </Wrapper>,
        );

        await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
        await user.click(screen.getByRole('button', { name: /Send reset link/i }));

        await waitFor(() => {
            expect(mockCaptureUnexpectedError).toHaveBeenCalledWith(
                submitFailure,
                expect.objectContaining({
                    layer: 'client',
                    component: 'ForgottenPasswordForm',
                    action: 'requestPasswordReset',
                    route: '/footy/forgottenpassword',
                    extra: {
                        email: 'test@example.com',
                    },
                }),
            );
        });

        expect(mockToPublicMessage).toHaveBeenCalledWith(
            submitFailure,
            'Unable to request a password reset right now.',
        );

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    color: 'red',
                    title: 'Error',
                    message: 'Readable failure',
                }),
            );
        });
    });
});

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth.client';
import { Wrapper } from '@/tests/components/lib/common';

let mockPush: Mock;

describe('ClaimSignup', () => {
    const props = {
        name: 'Sam Smith',
        email: 'sam@example.com',
        token: 'token-123',
    };
    const redirectPath = `/api/footy/auth/claim/${encodeURIComponent(props.token)}?redirect=/footy/profile`;
    const redirect = new URL(redirectPath, 'http://localhost').toString();

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.clearAllMocks();
        captureUnexpectedErrorMock.mockResolvedValue(undefined);
        mockPush = vi.fn();
        vi.mocked(useRouter).mockReturnValue({
            push: mockPush,
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('renders the form with the provided name and email', () => {
        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        expect(screen.getByRole('button', { name: /Create login/i })).toBeInTheDocument();
    });

    it('shows an invitation error and no form when the token is missing', () => {
        render(
            <Wrapper>
                <ClaimSignup {...props} token="" />
            </Wrapper>,
        );

        expect(screen.getByText(/Missing or invalid invitation details\./i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Create login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Sign in with Google/i })).not.toBeInTheDocument();
    });

    it('shows an invitation error and no form when the email is not a valid email address', () => {
        render(
            <Wrapper>
                <ClaimSignup {...props} email="not-an-email" />
            </Wrapper>,
        );

        expect(screen.getByText(/Missing or invalid invitation details\./i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Create login/i })).not.toBeInTheDocument();
    });

    it('disables the Create login button until the passwords are valid and match', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        const submitButton = screen.getByRole('button', { name: /Create login/i });
        expect(submitButton).toBeDisabled();

        await user.type(screen.getByPlaceholderText(/^Enter your password$/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm password/i), 'somethingElse');
        expect(submitButton).toBeDisabled();

        await user.clear(screen.getByLabelText(/Confirm password/i));
        await user.type(screen.getByLabelText(/Confirm password/i), 'Password123');
        expect(submitButton).toBeEnabled();
    });

    it('triggers social sign in with the claim redirect', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Sign in with Google/i }));
        await user.click(screen.getByRole('button', { name: /Sign in with Microsoft/i }));

        expect(signInWithGoogle).toHaveBeenCalledWith(redirect);
        expect(signInWithMicrosoft).toHaveBeenCalledWith(redirect);
    });

    it('shows an error notification when sign up fails', async () => {
        const user = userEvent.setup();
        (authClient.signUp.email as Mock).mockRejectedValueOnce(new Error('sign up failed'));

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText(/^Enter your password$/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Create login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        });
        expect(captureUnexpectedErrorMock).toHaveBeenCalled();

        const alert = screen.getByRole('alert');
        await user.click(within(alert).getByRole('button'));
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('calls alert when signUp onError callback fires', async () => {
        const user = userEvent.setup();
        const mockSignUpEmail = authClient.signUp.email as Mock;
        mockSignUpEmail.mockResolvedValueOnce({});
        const alertFn = vi.fn();
        vi.stubGlobal('alert', alertFn);

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText(/^Enter your password$/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Create login/i }));

        await waitFor(() => expect(mockSignUpEmail).toHaveBeenCalled());

        const [, options] = (mockSignUpEmail.mock.calls[0] ?? []) as [
            unknown,
            { onError?: (ctx: { error: { message: string } }) => void },
        ];
        options?.onError?.({ error: { message: 'Auth error' } });

        expect(alertFn).toHaveBeenCalledWith('Auth error');
        vi.unstubAllGlobals();
    });

    it('submits valid credentials and redirects on success', async () => {
        const user = userEvent.setup();
        const mockSignUpEmail = authClient.signUp.email as Mock;
        mockSignUpEmail.mockResolvedValueOnce({});

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.type(screen.getByPlaceholderText(/^Enter your password$/i), 'Password123');
        await user.type(screen.getByLabelText(/Confirm password/i), 'Password123');
        await user.click(screen.getByRole('button', { name: /Create login/i }));

        await waitFor(() => {
            expect(mockSignUpEmail).toHaveBeenCalledWith(
                {
                    name: props.name,
                    email: props.email,
                    password: 'Password123',
                },
                expect.anything(),
            );
            expect(mockPush).toHaveBeenCalledWith(redirectPath);
        });

        const [, options] = (mockSignUpEmail.mock.calls[0] ?? []) as [
            { name: string; email: string; password: string },
            { onError?: (error: unknown) => void },
        ];
        expect(options?.onError).toEqual(expect.any(Function));
    });
});

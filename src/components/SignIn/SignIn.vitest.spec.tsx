import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter } from 'next/navigation';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { SignIn } from '@/components/SignIn/SignIn';
import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth.client';
import { Wrapper } from '@/tests/components/lib/common';

describe('SignIn', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        vi.mocked(useRouter).mockReturnValue({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            prefetch: vi.fn(),
        });
        vi.mocked(usePathname).mockReturnValue('/footy/auth/signin');
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('renders sign in form', () => {
        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('renders login message when admin is false', () => {
        render(
            <Wrapper>
                <SignIn admin={false} />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { name: /must be logged in to use this page/i })).toBeInTheDocument();
    });

    it('renders admin message when admin is true', () => {
        render(
            <Wrapper>
                <SignIn admin={true} />
            </Wrapper>,
        );

        expect(screen.getByRole('heading', { name: /must be logged in as an administrator/i })).toBeInTheDocument();
    });

    it('disables the Sign In button when the email is invalid', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In$/i });

        await user.type(emailInput, 'invalid-email');
        await user.type(passwordInput, 'validPassword123');

        expect(submitButton).toBeDisabled();
        expect(await screen.findByText(/Invalid email format/i)).toBeInTheDocument();
    });

    it('disables the Sign In button when the password is too short', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In$/i });

        await user.type(emailInput, 'valid.email@example.com');
        await user.type(passwordInput, 'short');
        await user.tab();

        expect(submitButton).toBeDisabled();
        expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it('enables the Sign In button once both fields are valid', async () => {
        const user = userEvent.setup();

        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In$/i });

        expect(submitButton).toBeDisabled();

        await user.type(emailInput, 'valid.email@example.com');
        await user.type(passwordInput, 'validPassword123');

        expect(submitButton).toBeEnabled();
    });

    it('shows an error when valid input is provided but the login fails', async () => {
        const user = userEvent.setup();
        (authClient.signIn.email as Mock).mockRejectedValueOnce(new Error('boom'));

        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In$/i });

        await user.type(emailInput, 'valid.email@example.com');
        await user.type(passwordInput, 'validPassword123');
        await user.click(submitButton);

        expect(await screen.findByText(/Login failed. Please check your details and try again./i)).toBeInTheDocument();
    });

    it('calls signInWithGoogle when the Google button is clicked', async () => {
        const user = userEvent.setup();
        render(<Wrapper><SignIn /></Wrapper>);

        await user.click(screen.getByRole('button', { name: /Sign in with Google/i }));

        expect(signInWithGoogle as Mock).toHaveBeenCalled();
    });

    it('calls signInWithMicrosoft when the Microsoft button is clicked', async () => {
        const user = userEvent.setup();
        render(<Wrapper><SignIn /></Wrapper>);

        await user.click(screen.getByRole('button', { name: /Sign in with Microsoft/i }));

        expect(signInWithMicrosoft as Mock).toHaveBeenCalled();
    });

    it('closes the error notification when its close button is clicked', async () => {
        const user = userEvent.setup();
        (authClient.signIn.email as Mock).mockRejectedValueOnce(new Error('fail'));

        render(<Wrapper><SignIn /></Wrapper>);

        await user.type(screen.getByLabelText(/Email/i), 'a@b.com');
        await user.type(screen.getByLabelText(/Password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /Sign In$/i }));

        const alert = await screen.findByRole('alert');
        await user.click(within(alert).getByRole('button'));

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('succeeds when valid credentials are provided', async () => {
        const user = userEvent.setup();
        (authClient.signIn.email as Mock).mockResolvedValueOnce({ user: { id: '123' } });

        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /Sign In$/i });

        await user.type(emailInput, 'valid.email@example.com');
        await user.type(passwordInput, 'validPassword123');
        await user.click(submitButton);

        expect(screen.queryByText(/Login failed. Please check your details and try again./i)).not.toBeInTheDocument();
    });
});

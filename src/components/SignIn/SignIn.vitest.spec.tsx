
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter } from 'next/navigation';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { SignIn } from '@/components/SignIn/SignIn';
import { authClient } from '@/lib/authClient';
import { Wrapper } from '@/tests/components/lib/common';

describe('SignIn', () => {
    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
            refresh: vi.fn(),
            prefetch: vi.fn(),
        });
        (usePathname as Mock).mockReturnValue('/footy/auth/signin');
    });

    it('renders sign in form', () => {
        render(
            <Wrapper>
                <SignIn />
            </Wrapper>,
        );

        expect(screen.getByTestId('sign-in')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('renders login message when admin is false', () => {
        render(
            <Wrapper>
                <SignIn admin={false} />
            </Wrapper>,
        );

        expect(screen.getByTestId('must-be-logged-in')).toBeInTheDocument();
    });

    it('renders admin message when admin is true', () => {
        render(
            <Wrapper>
                <SignIn admin={true} />
            </Wrapper>,
        );

        expect(screen.getByTestId('must-be-admin')).toBeInTheDocument();
    });

    it('complains when the email is invalid', async () => {
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
        await user.click(submitButton);

        expect(await screen.findByText(/Invalid email format/i)).toBeInTheDocument();
    });

    it('complains when the password is too short', async () => {
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
        await user.click(submitButton);

        expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it('shows an error when valid input is provided but the login fails', async () => {
        const user = userEvent.setup();
        (authClient.signInWithEmail as Mock).mockRejectedValueOnce(new Error('boom'));

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

    it('succeeds when valid credentials are provided', async () => {
        const user = userEvent.setup();
        (authClient.signInWithEmail as Mock).mockResolvedValueOnce({ user: { id: '123' } });

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

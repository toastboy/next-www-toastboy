jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    usePathname: () => '/footy/auth/signin',
}));

jest.mock('@/lib/authClient', () => ({
    authClient: {
        signInWithEmail: jest.fn(),
        useSession: jest.fn(() => ({
            data: null,
            isPending: false,
            error: null,
        })),
    },
    signInWithGoogle: jest.fn(),
    signInWithMicrosoft: jest.fn(),
}));

// jest.mock('sentry.server.config', () => ({
//     __esModule: true,
// }));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SignIn } from '@/components/SignIn/SignIn';
import { Wrapper } from '@/tests/components/lib/common';

describe('SignIn', () => {
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
});

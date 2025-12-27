const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/lib/auth-client', () => ({
    authClient: {
        signUp: {
            email: jest.fn(),
        },
    },
    signInWithGoogle: jest.fn(),
    signInWithMicrosoft: jest.fn(),
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { authClient, signInWithGoogle, signInWithMicrosoft } from '@/lib/auth-client';
import { Wrapper } from '@/tests/components/lib/common';

describe('ClaimSignup', () => {
    const props = {
        name: 'Sam Smith',
        email: 'sam@example.com',
        token: 'token-123',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form with the provided name and email', () => {
        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Name/i)).toHaveValue(props.name);
        expect(screen.getByLabelText(/Email/i)).toHaveValue(props.email);
        expect(screen.getByLabelText(/Email/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Create login/i })).toBeInTheDocument();
    });

    it('triggers social sign in with the claim redirect', async () => {
        const user = userEvent.setup();
        const redirect = `/footy/auth/claim/complete?token=${encodeURIComponent(props.token)}`;

        render(
            <Wrapper>
                <ClaimSignup {...props} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Continue with Google/i }));
        await user.click(screen.getByRole('button', { name: /Continue with Microsoft/i }));

        expect(signInWithGoogle).toHaveBeenCalledWith(redirect);
        expect(signInWithMicrosoft).toHaveBeenCalledWith(redirect);
    });

    it('submits valid credentials and redirects on success', async () => {
        const user = userEvent.setup();
        const redirect = `/footy/auth/claim/complete?token=${encodeURIComponent(props.token)}`;
        const mockSignUpEmail = authClient.signUp.email as jest.Mock;
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
                expect.objectContaining({
                    onError: expect.any(Function),
                }),
            );
            expect(mockPush).toHaveBeenCalledWith(redirect);
        });
    });
});

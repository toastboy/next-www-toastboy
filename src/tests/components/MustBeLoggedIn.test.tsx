jest.mock('components/SignIn/SignIn', () => {
    const MockSignIn = () => <div data-testid="mock-sign-in" />;
    MockSignIn.displayName = 'MockSignIn';
    return { SignIn: MockSignIn };
});

jest.mock('lib/authClient', () => ({
    authClient: {
        useSession: jest.fn(),
        isLoggedIn: jest.fn().mockImplementation((session) => session?.data?.user != null),
        isAdmin: jest.fn().mockImplementation((session) => session?.data?.user?.role === 'admin'),
    },
}));

import { render, screen, waitFor } from '@testing-library/react';

import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { authClient } from '@/lib/authClient';

import { Wrapper } from './lib/common';

describe('MustBeLoggedIn', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: { user: { id: '1' } },
            isPending: false,
            error: null,
        });
    });

    it('renders children when user is logged in', async () => {
        render(
            <Wrapper>
                <MustBeLoggedIn>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        await waitFor(() => {
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });

    it('renders sign in when user is not logged in', () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        render(
            <Wrapper>
                <MustBeLoggedIn showSignIn={true}>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        expect(screen.getByTestId('mock-sign-in')).toBeInTheDocument();
    });
});

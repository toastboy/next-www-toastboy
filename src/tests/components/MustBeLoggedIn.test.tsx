jest.mock('components/SignIn/SignIn', () => {
    const MockSignIn = () => <div data-testid="mock-sign-in" />;
    MockSignIn.displayName = 'MockSignIn';
    return MockSignIn;
});

jest.mock('lib/authClient', () => ({
    authClient: {
        useSession: jest.fn(),
        isLoggedIn: jest.fn(() => true),
        isAdmin: jest.fn(() => false),
    },
}));

import { render, screen } from '@testing-library/react';

import MustBeLoggedIn from '@/components/MustBeLoggedIn/MustBeLoggedIn';
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

    it('renders children when user is logged in', () => {
        render(
            <Wrapper>
                <MustBeLoggedIn>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
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

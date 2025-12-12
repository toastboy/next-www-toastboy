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

jest.mock('sentry.server.config', () => ({
    __esModule: true,
}));

import { render, screen } from '@testing-library/react';

import { SignIn } from '@/components/SignIn/SignIn';

import { Wrapper } from './lib/common';

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

    it('renders admin message when admin is true', () => {
        render(
            <Wrapper>
                <SignIn admin={true} />
            </Wrapper>,
        );

        expect(screen.getByTestId('must-be-admin')).toBeInTheDocument();
    });
});

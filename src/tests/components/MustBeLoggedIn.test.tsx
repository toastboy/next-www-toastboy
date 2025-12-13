jest.mock('@/components/SignIn/SignIn');
jest.mock('@/lib/authClient', () => ({
    authClient: {
        useSession: jest.fn(),
        isLoggedIn: jest.fn().mockImplementation(
            (session: Session) => session?.data?.user != null,
        ),
        isAdmin: jest.fn().mockImplementation(
            (session: Session) => session?.data?.user?.role === 'admin',
        ),
    },
}));

import { act, render, screen } from '@testing-library/react';

import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { authClient, Session } from '@/lib/authClient';
import config from '@/lib/config';
import { Wrapper } from '@/tests/components/lib/common';

describe('MustBeLoggedIn', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (authClient.isLoggedIn as jest.Mock).mockImplementation(
            (session: Session) => session?.data?.user != null,
        );
        (authClient.isAdmin as jest.Mock).mockImplementation(
            (session: Session) => session?.data?.user?.role === 'admin',
        );
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: { user: { id: '1' } },
            isPending: false,
            error: null,
        });
    });

    it('renders nothing (null) while session is pending', () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: true,
            error: null,
        });

        const { container } = render(
            <Wrapper>
                <MustBeLoggedIn>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        expect(screen.queryByText(/SignIn/)).not.toBeInTheDocument();
        expect(container.querySelector('div')).not.toBeInTheDocument();
    });

    it('renders signin form when user is not logged in', () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        render(
            <Wrapper>
                <MustBeLoggedIn>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        expect(screen.queryByText(/SignIn:\s+\{"admin":false\}/)).toBeInTheDocument();
    });

    it('renders signin as admin form when admin is not logged in', () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        render(
            <Wrapper>
                <MustBeLoggedIn admin={true}>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        expect(screen.queryByText(/SignIn:\s+\{"admin":true\}/)).toBeInTheDocument();
    });

    it('renders nothing when user is not logged in and showSignIn is false', () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        render(
            <Wrapper>
                <MustBeLoggedIn admin={true} showSignIn={false}>
                    <div>Protected Content</div>
                </MustBeLoggedIn>
            </Wrapper>,
        );

        expect(screen.queryByText(/SignIn/)).not.toBeInTheDocument();
    });

    it('sets isValid when checkSession runs after session stops pending', async () => {
        jest.useFakeTimers();

        const sessionState: { data: { user: { id: string; role: string } } | null; isPending: boolean; error: null } = {
            data: null,
            isPending: true,
            error: null,
        };

        (authClient.useSession as jest.Mock).mockImplementation(() => sessionState);
        const onValidationChange = jest.fn();

        try {
            const { rerender } = render(
                <Wrapper>
                    <MustBeLoggedIn onValidationChange={onValidationChange}>
                        <div data-testid="protected">Protected Content</div>
                    </MustBeLoggedIn>
                </Wrapper>,
            );

            expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
            expect(onValidationChange).not.toHaveBeenCalled();

            act(() => {
                sessionState.data = { user: { id: '1', role: 'user' } };
                sessionState.isPending = false;
            });

            rerender(
                <Wrapper>
                    <MustBeLoggedIn onValidationChange={onValidationChange}>
                        <div data-testid="protected">Protected Content</div>
                    </MustBeLoggedIn>
                </Wrapper>,
            );

            onValidationChange.mockClear();

            act(() => {
                jest.advanceTimersByTime(config.sessionRevalidate);
            });

            const content = await screen.findByTestId('protected');
            expect(content).toBeInTheDocument();
            expect(onValidationChange).toHaveBeenCalledTimes(1);
            expect(onValidationChange).toHaveBeenCalledWith(true);
        } finally {
            jest.useRealTimers();
        }
    });
});

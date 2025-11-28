jest.mock('lib/auth-client', () => ({
    authClient: {
        useSession: jest.fn(),
    },
}));
const push = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UserButton from 'components/UserButton/UserButton';
import { authClient } from 'lib/auth-client';

import { Wrapper } from "./lib/common";

describe('UserButton', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        // Reset URL between tests to avoid bleed-over when components change location
        window.history.pushState({}, '', '/');
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    name: 'Harriette Spoonlicker',
                    email: 'hspoonlicker@outlook.com',
                    playerId: 12,
                },
            },
            isPending: false,
            error: null,
        });
    });

    it('renders sign in button with no session present', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('Sign In')).toBeInTheDocument();
        });
    });

    it('redirects to sign in page when sign in button is clicked with no user in the session', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: { user: null },
            isPending: false,
            error: null,
        });

        render(<Wrapper><UserButton /></Wrapper>);

        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/footy/auth/signin');
        });
    });

    it('redirects to sign in page when sign in button is clicked with no session present', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        render(<Wrapper><UserButton /></Wrapper>);

        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/footy/auth/signin');
        });
    });

    it('renders user name and email', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('Harriette Spoonlicker')).toBeInTheDocument();
            expect(screen.getByText('hspoonlicker@outlook.com')).toBeInTheDocument();
        });
    });

    it('renders user avatar', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const avatar = screen.getByRole('img');
        await waitFor(() => {
            expect(avatar).toBeInTheDocument();
        });
        expect(avatar).toHaveAttribute('src', "/api/footy/player/12/mugshot");;
    });

    it('renders placeholder avatar', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: {
                user: {
                    name: 'Unknown Player',
                    email: '',
                    playerId: 0,
                },
            },
            isPending: false,
            error: null,
        });

        render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
        });
    });

    it('renders chevron icon', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const chevronIcon = screen.getByTestId('chevron-icon');
        await waitFor(() => {
            expect(chevronIcon).toBeInTheDocument();
        });
    });
});

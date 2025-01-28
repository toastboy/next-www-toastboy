jest.mock('lib/auth-client', () => ({
    authClient: {
        useSession: jest.fn(),
    },
}));

import { act, render, screen, waitFor } from '@testing-library/react';
import { BetterFetchError } from 'better-auth/react';
import UserButton from 'components/UserButton/UserButton';
import { authClient } from 'lib/auth-client';
import { loaderClass, Wrapper } from "./lib/common";

describe('UserButton', () => {
    beforeEach(() => {
        jest.resetAllMocks();
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

    it('redirects to sign in page when sign in button is clicked with no session', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: null,
        });

        let originalLocation = window.location;

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { ...originalLocation, href: '' },
        });

        render(<Wrapper><UserButton /></Wrapper>);

        act(() => {
            screen.getByText('Sign In').click();
        });

        await waitFor(() => {
            expect(window.location.href).toBe('/footy/auth/signin');
        });

        window.location = originalLocation;
    });

    it('redirects to sign in page when sign in button is clicked with no user in the session', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: { user: null },
            isPending: false,
            error: null,
        });

        let originalLocation = window.location;

        Object.defineProperty(window, 'location', {
            writable: true,
            value: { ...originalLocation, href: '' },
        });

        render(<Wrapper><UserButton /></Wrapper>);

        act(() => {
            screen.getByText('Sign In').click();
        });

        await waitFor(() => {
            expect(window.location.href).toBe('/footy/auth/signin');
        });

        window.location = originalLocation;
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
            expect(avatar).toHaveAttribute('src', "/api/footy/player/12/mugshot");
        });
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

        const { container } = render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector('.mantine-Avatar-placeholder')).toBeInTheDocument();
        });
    });

    it('renders chevron icon', async () => {
        render(<Wrapper><UserButton /></Wrapper>);
        const chevronIcon = screen.getByTestId('chevron-icon');
        await waitFor(() => {
            expect(chevronIcon).toBeInTheDocument();
        });
    });

    it('renders loading spinner', async () => {
        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: true,
            error: null,
        });

        const { container } = render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).toBeInTheDocument();
        });
    });

    it('renders error message', async () => {
        const error: BetterFetchError = {
            name: "BetterFetchError",
            message: "The user is not authorized to perform this action.",
            status: 403,
            statusText: "Forbidden",
            error: "The user is not authorized to perform this action.",
        };

        (authClient.useSession as jest.Mock).mockReturnValue({
            data: null,
            isPending: false,
            error: error,
        });

        render(<Wrapper><UserButton /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('Error loading user: The user is not authorized to perform this action.')).toBeInTheDocument();
        });
    });
});

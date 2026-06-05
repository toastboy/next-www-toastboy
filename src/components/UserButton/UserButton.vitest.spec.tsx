import { notifications } from '@mantine/notifications';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { UserButton } from '@/components/UserButton/UserButton';
import { Wrapper } from '@/tests/components/lib/common';

describe('UserButton', () => {
    let push: Mock;

    beforeEach(() => {
        // Reset URL between tests to avoid bleed-over when components change location
        window.history.pushState({}, '', '/');
        push = vi.fn();
        vi.mocked(useRouter).mockReturnValue({
            push,
            replace: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
            prefetch: vi.fn(),
        });
    });

    it('renders sign in button with no session present', async () => {
        render(<Wrapper><UserButton user={null} /></Wrapper>);
        await waitFor(() => {
            expect(screen.getByText('Sign In')).toBeInTheDocument();
        });
    });

    it('redirects to sign in page when sign in button is clicked with no user in the session', async () => {
        render(<Wrapper><UserButton user={null} /></Wrapper>);

        fireEvent.click(screen.getByText('Sign In'));

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/footy/auth/signin');
        });
    });

    it('renders user name and email', async () => {
        render(
            <Wrapper>
                <UserButton user={{
                    name: 'Harriette Spoonlicker',
                    email: 'hspoonlicker@outlook.com',
                    playerId: 12,
                    role: 'user',
                }} />
            </Wrapper>,
        );
        await waitFor(() => {
            expect(screen.getByText('Harriette Spoonlicker')).toBeInTheDocument();
            expect(screen.getByText('hspoonlicker@outlook.com')).toBeInTheDocument();
        });
    });

    it('falls back to empty name and email when user values are null', async () => {
        render(
            <Wrapper>
                <UserButton user={{
                    name: null,
                    email: null,
                    playerId: 12,
                    role: 'user',
                }} />
            </Wrapper>,
        );

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'User menu' })).toBeInTheDocument();
        });
        expect(screen.queryByText(/harriette|spoonlicker/i)).not.toBeInTheDocument();
    });

    it('renders user avatar', async () => {
        render(
            <Wrapper>
                <UserButton user={{
                    name: 'Harriette Spoonlicker',
                    email: 'hspoonlicker@outlook.com',
                    playerId: 12,
                    role: 'user',
                }} />
            </Wrapper>,
        );
        const avatar = screen.getByRole('img');
        await waitFor(() => {
            expect(avatar).toBeInTheDocument();
        });
        expect(avatar).toHaveAttribute('src', "/api/footy/player/12/mugshot");
    });

    it('renders placeholder avatar when playerId is 0', async () => {
        render(
            <Wrapper>
                <UserButton user={{
                    name: 'Unknown Player',
                    email: '',
                    playerId: 0,
                    role: 'user',
                }} />
            </Wrapper>,
        );
        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'User menu' })).toBeInTheDocument();
        });
        // Avatar with no src renders a placeholder image (no mugshot URL)
        expect(screen.queryByRole('img', { name: /api\/footy\/player/ })).not.toBeInTheDocument();
    });

    it('opens menu showing account links on click', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));

        expect(await screen.findByText('My Profile')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('shows End impersonation item when user is being impersonated', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user', impersonatedBy: 'admin@example.com' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));

        expect(await screen.findByText('End impersonation')).toBeInTheDocument();
    });

    it('does not show End impersonation when not impersonating', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));
        await screen.findByText('Sign Out');

        expect(screen.queryByText('End impersonation')).not.toBeInTheDocument();
    });

    it('calls sign-out API and refreshes the router on success', async () => {
        const user = userEvent.setup();
        const refresh = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ push, replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh, prefetch: vi.fn() });
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));
        await user.click(await screen.findByText('Sign Out'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/sign-out', expect.objectContaining({ method: 'POST' }));
            expect(refresh).toHaveBeenCalled();
        });
        expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
            color: 'teal',
            title: 'Signed out',
        }));
    });

    it('shows error notification when sign-out API fails', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        vi.spyOn(global, 'fetch').mockResolvedValue(new Response('Unauthorized', { status: 401 }));

        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));
        await user.click(await screen.findByText('Sign Out'));

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Error',
            }));
        });
    });

    it('calls stop-impersonating API and refreshes router on success', async () => {
        const user = userEvent.setup();
        const refresh = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ push, replace: vi.fn(), back: vi.fn(), forward: vi.fn(), refresh, prefetch: vi.fn() });
        vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 200 }));

        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user', impersonatedBy: 'admin@example.com' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));
        await user.click(await screen.findByText('End impersonation'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/admin/stop-impersonating', expect.objectContaining({ method: 'POST' }));
            expect(refresh).toHaveBeenCalled();
        });
    });

    it('shows error notification when stop-impersonating API fails', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        vi.spyOn(global, 'fetch').mockResolvedValue(new Response('Forbidden', { status: 403 }));

        render(
            <Wrapper>
                <UserButton user={{ name: 'Harriette Spoonlicker', email: 'h@example.com', playerId: 12, role: 'user', impersonatedBy: 'admin@example.com' }} />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: 'User menu' }));
        await user.click(await screen.findByText('End impersonation'));

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Error',
            }));
        });
    });
});

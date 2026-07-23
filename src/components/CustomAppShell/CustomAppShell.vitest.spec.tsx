import { Text, useMantineTheme } from '@mantine/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { Component, ReactNode } from 'react';
import { vi } from 'vitest';

import { CustomAppShell } from '@/components/CustomAppShell/CustomAppShell';
import { isAppError } from '@/lib/errors';
import type { AuthUserSummary } from '@/types/AuthUser';

interface ErrorBoundaryState {
    error: Error | null;
}

class TestErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    render() {
        const { error } = this.state;

        if (error) {
            return (
                <div role="alert">
                    <p>{error.message}</p>
                    {isAppError(error) ? <p>Public message: {error.publicMessage}</p> : null}
                </div>
            );
        }

        return this.props.children;
    }
}

type MockBurgerProps = {
    opened?: boolean;
    onClick?: () => void;
    hiddenFrom?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/'),
}));

vi.mock('@mantine/core', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mantine/core')>();

    const MockAppShellRoot = ({ children, navbar }: { children?: React.ReactNode; navbar?: { collapsed?: { mobile?: boolean } } }) => (
        <div data-testid="app-shell" data-navbar-collapsed-mobile={String(navbar?.collapsed?.mobile ?? false)}>{children}</div>
    );

    const Header = ({ children }: { children?: React.ReactNode }) => <div data-testid="app-shell-header">{children}</div>;
    const Navbar = ({ children }: { children?: React.ReactNode }) => <div data-testid="app-shell-navbar">{children}</div>;
    const Main = ({ children }: { children?: React.ReactNode }) => <main>{children}</main>;
    const Footer = ({ children }: { children?: React.ReactNode }) => <footer>{children}</footer>;

    const AppShell = Object.assign(MockAppShellRoot, {
        Header,
        Navbar,
        Main,
        Footer,
    });

    return {
        ...actual,
        AppShell,
        Badge: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
        Burger: ({ opened, onClick, hiddenFrom, ...props }: MockBurgerProps) => (
            <button {...props} data-hidden-from={hiddenFrom} data-opened={opened ? 'true' : undefined} onClick={onClick} type="button" />
        ),
        Container: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
        Group: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
        Image: ({ alt, src }: { alt?: string; src?: string }) => <div aria-label={alt} data-src={src} role="img" />,
        Stack: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
        Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
        useMantineTheme: vi.fn(),
    };
});

vi.mock('@/components/NavBarNested/NavBarNested');

describe('CustomAppShell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(usePathname).mockReturnValue('/footy/results');
        vi.mocked(useMantineTheme).mockReturnValue({
            other: { appShellMaxWidth: 1280, appShellMinWidth: 320 },
        } as ReturnType<typeof useMantineTheme>);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders app shell with header, navbar, and footer', () => {
        render(
            <CustomAppShell>
                <Text>Test Content</Text>
            </CustomAppShell>,
        );

        expect(screen.getByText('Toastboy FC')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('closes the mobile navbar when the pathname changes', async () => {
        const { rerender } = render(
            <CustomAppShell>
                <Text>Test Content</Text>
            </CustomAppShell>,
        );

        const burgerButton = screen.getByRole('button', { name: 'Toggle navigation' });
        fireEvent.click(burgerButton);

        expect(screen.getByTestId('app-shell')).toHaveAttribute('data-navbar-collapsed-mobile', 'false');
        expect(burgerButton).toHaveAttribute('data-opened', 'true');

        vi.mocked(usePathname).mockReturnValue('/footy/fixtures');

        rerender(
            <CustomAppShell>
                <Text>Test Content</Text>
            </CustomAppShell>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('app-shell')).toHaveAttribute('data-navbar-collapsed-mobile', 'true');
            expect(screen.getByRole('button', { name: 'Toggle navigation' })).not.toHaveAttribute('data-opened');
        });
    });

    it('shows the dev mode badge when devMode is true', () => {
        render(
            <CustomAppShell devMode={true}>
                <Text>Content</Text>
            </CustomAppShell>,
        );

        expect(screen.getByText('dev mode')).toBeInTheDocument();
    });

    it('does not show the dev mode badge when devMode is not set', () => {
        render(
            <CustomAppShell>
                <Text>Content</Text>
            </CustomAppShell>,
        );

        expect(screen.queryByText('dev mode')).not.toBeInTheDocument();
    });

    it('passes the user prop to NavBarNested', () => {
        const user: AuthUserSummary = {
            name: 'Test User',
            email: 'test@example.com',
            playerId: 42,
            role: 'user',
        };

        render(
            <CustomAppShell user={user}>
                <Text>Content</Text>
            </CustomAppShell>,
        );

        expect(screen.getByText(/NavBarNested:/)).toBeInTheDocument();
        expect(screen.getByText(/test@example\.com/)).toBeInTheDocument();
    });

    it('renders the crest image', () => {
        render(
            <CustomAppShell>
                <Text>Content</Text>
            </CustomAppShell>,
        );

        expect(screen.getByRole('img', { name: 'Toastboy FC Crest' })).toBeInTheDocument();
    });

    it('wraps the crest image in a link to /footy', () => {
        render(
            <CustomAppShell>
                <Text>Content</Text>
            </CustomAppShell>,
        );

        const crest = screen.getByRole('img', { name: 'Toastboy FC Crest' });
        expect(crest.closest('a')).toHaveAttribute('href', '/footy');
    });

    it('throws when the theme is missing appShellMaxWidth/appShellMinWidth', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        // React retries a failed render synchronously before giving up, so the
        // broken theme must be queued for both attempts.
        vi.mocked(useMantineTheme)
            .mockReturnValueOnce({ other: {} } as ReturnType<typeof useMantineTheme>)
            .mockReturnValueOnce({ other: {} } as ReturnType<typeof useMantineTheme>);

        render(
            <TestErrorBoundary>
                <CustomAppShell>
                    <Text>Content</Text>
                </CustomAppShell>
            </TestErrorBoundary>,
        );

        expect(screen.getByRole('alert')).toHaveTextContent('CustomAppShell requires the app theme');
        expect(screen.getByText('Public message: App theme is not configured.')).toBeInTheDocument();
    });

    it('throws (rather than crashing with a TypeError) when the theme has no "other" at all', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);

        // React retries a failed render synchronously before giving up, so the
        // broken theme must be queued for both attempts.
        vi.mocked(useMantineTheme)
            .mockReturnValueOnce({} as ReturnType<typeof useMantineTheme>)
            .mockReturnValueOnce({} as ReturnType<typeof useMantineTheme>);

        render(
            <TestErrorBoundary>
                <CustomAppShell>
                    <Text>Content</Text>
                </CustomAppShell>
            </TestErrorBoundary>,
        );

        expect(screen.getByRole('alert')).toHaveTextContent('CustomAppShell requires the app theme');
        expect(screen.getByText('Public message: App theme is not configured.')).toBeInTheDocument();
    });
});

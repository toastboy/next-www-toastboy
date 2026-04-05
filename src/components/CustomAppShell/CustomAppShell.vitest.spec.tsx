import { Text } from '@mantine/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { vi } from 'vitest';

import { CustomAppShell } from '@/components/CustomAppShell/CustomAppShell';

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
        Burger: ({ opened, onClick, hiddenFrom, ...props }: MockBurgerProps) => (
            <button {...props} data-hidden-from={hiddenFrom} data-opened={opened ? 'true' : undefined} onClick={onClick} type="button" />
        ),
        Container: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
        Group: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
        Image: ({ alt, src }: { alt?: string; src?: string }) => <div aria-label={alt} data-src={src} role="img" />,
        Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
    };
});

vi.mock('@/components/NavBarNested/NavBarNested');

describe('CustomAppShell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(usePathname).mockReturnValue('/footy/results');
    });

    it('renders app shell with header, navbar, and footer', () => {
        render(
            <CustomAppShell>
                <Text>Test Content</Text>
            </CustomAppShell>,
        );

        expect(screen.getByText('Toastboy FC')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByText(/© 2025 Toastboy FC/i)).toBeInTheDocument();
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
});

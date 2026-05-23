import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { NavBarNested } from '@/components/NavBarNested/NavBarNested';
import { Wrapper } from '@/tests/components/lib/common';

vi.mock('@/components/UserButton/UserButton');

describe('NavBarNested', () => {
    it('renders navbar header region', () => {
        render(<Wrapper><NavBarNested /></Wrapper>);
        expect(screen.getByRole('region', { name: 'Navbar header' })).toBeInTheDocument();
    });

    it('renders navbar links region with navigation links', () => {
        render(<Wrapper><NavBarNested /></Wrapper>);
        expect(screen.getByRole('region', { name: 'Navbar links' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Results' })).toBeInTheDocument();
    });

    it('renders navbar footer region', () => {
        render(<Wrapper><NavBarNested /></Wrapper>);
        expect(screen.getByRole('region', { name: 'Navbar footer' })).toBeInTheDocument();
    });

    it('hides admin links when user is not an admin', () => {
        const user = { name: 'Gary Player', email: 'gary@example.com', playerId: 1, role: 'user' as const };
        render(<Wrapper><NavBarNested user={user} /></Wrapper>);
        expect(screen.queryByRole('link', { name: 'Picker' })).not.toBeInTheDocument();
    });

    it('shows admin links when user has admin role', () => {
        const user = { name: 'Gary Player', email: 'gary@example.com', playerId: 1, role: 'admin' as const };
        render(<Wrapper><NavBarNested user={user} /></Wrapper>);
        expect(screen.getByRole('link', { name: 'Picker' })).toBeInTheDocument();
    });
});

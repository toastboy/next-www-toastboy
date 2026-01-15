import { render, screen } from '@testing-library/react';

import { NavBarNested } from '@/components/NavBarNested/NavBarNested';

import { Wrapper } from '@/tests/components/lib/common';

jest.mock('@/components/UserButton/UserButton');

describe('NavBarNested', () => {
    it('renders navbar header', () => {
        render(<Wrapper><NavBarNested /></Wrapper>);
        expect(screen.getByTestId('navbar-header')).toBeInTheDocument();
    });

    it('renders navbar links', () => {
        render(<Wrapper><NavBarNested /></Wrapper>);
        expect(screen.getByTestId('navbar-links')).toBeInTheDocument();
    });

    it('renders navbar footer', () => {
        render(<Wrapper><NavBarNested /></Wrapper>);
        expect(screen.getByTestId('navbar-footer')).toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';

import { NavBarNested } from '@/components/NavBarNested/NavBarNested';

import { Wrapper } from "./lib/common";

jest.mock('@/components/UserButton/UserButton', () => {
    const MockUserButton = () => <div data-testid="mock-user-button" />;
    MockUserButton.displayName = 'MockUserButton';
    return { UserButton: MockUserButton };
});

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

import { render, screen } from '@testing-library/react';
import NavbarNested from 'components/NavBarNested/NavBarNested';

import { Wrapper } from "./lib/common";

jest.mock('components/UserButton/UserButton', () => {
    const MockUserButton = () => <div data-testid="mock-user-button" />;
    MockUserButton.displayName = 'MockUserButton';
    return MockUserButton;
});

describe('NavbarNested', () => {
    it('renders navbar header', () => {
        render(<Wrapper><NavbarNested /></Wrapper>);
        expect(screen.getByTestId('navbar-header')).toBeInTheDocument();
    });

    it('renders navbar links', () => {
        render(<Wrapper><NavbarNested /></Wrapper>);
        expect(screen.getByTestId('navbar-links')).toBeInTheDocument();
    });

    it('renders navbar footer', () => {
        render(<Wrapper><NavbarNested /></Wrapper>);
        expect(screen.getByTestId('navbar-footer')).toBeInTheDocument();
    });
});

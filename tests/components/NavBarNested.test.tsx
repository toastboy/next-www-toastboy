import { render } from '@testing-library/react';
import NavbarNested from 'components/NavBarNested/NavBarNested';
import { Wrapper } from "./lib/common";

jest.mock('components/UserButton/UserButton', () => {
    const MockUserButton = () => <div data-testid="mock-user-button" />;
    MockUserButton.displayName = 'MockUserButton';
    return MockUserButton;
});

describe('NavbarNested', () => {
    it('renders navbar header', () => {
        const { container } = render(<Wrapper><NavbarNested /></Wrapper>);
        expect(container.querySelector('.header')).toBeInTheDocument();
    });

    it('renders navbar links', () => {
        const { container } = render(<Wrapper><NavbarNested /></Wrapper>);
        expect(container.querySelector('.links')).toBeInTheDocument();
    });

    it('renders navbar footer', () => {
        const { container } = render(<Wrapper><NavbarNested /></Wrapper>);
        expect(container.querySelector('.footer')).toBeInTheDocument();
    });
});

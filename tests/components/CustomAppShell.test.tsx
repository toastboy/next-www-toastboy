import { render, screen } from '@testing-library/react';
import CustomAppShell from 'components/CustomAppShell/CustomAppShell';
import { Wrapper } from "./lib/common";

describe('CustomAppShell', () => {
    it('renders children', () => {
        render(<Wrapper><CustomAppShell>Test Children</CustomAppShell></Wrapper>);
        expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('toggles navbar on burger click', () => {
        render(<Wrapper><CustomAppShell>Test Children</CustomAppShell></Wrapper>);
        const burgerButton = screen.getByLabelText('Toggle navigation');
        expect(burgerButton).toBeInTheDocument();
        // TODO: Check function such as showing and hiding the navbar
    });

    it('renders the Toastboy FC logo', () => {
        render(<Wrapper><CustomAppShell>Test Children</CustomAppShell></Wrapper>);
        const logo = screen.getByAltText('Toastboy FC Crest');
        expect(logo).toBeInTheDocument();
    });
});

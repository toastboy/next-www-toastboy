import { fireEvent, render, screen } from '@testing-library/react';

import { NavBarLinksGroup } from '@/components/NavBarLinksGroup/NavBarLinksGroup';

import { Wrapper } from "./lib/common";

describe('NavBarLinksGroup', () => {
    const links = [
        { label: 'Link 1', link: '/link1' },
        { label: 'Link 2', link: '/link2' },
        { label: 'Link 3', link: '/link3' },
    ];

    it('renders label', () => {
        render(<Wrapper><NavBarLinksGroup label="Group Label" /></Wrapper>);
        expect(screen.getByText('Group Label')).toBeInTheDocument();
    });

    it('renders links when opened', () => {
        render(<Wrapper><NavBarLinksGroup label="Group Label" initiallyOpened links={links} /></Wrapper>);
        fireEvent.click(screen.getByText('Group Label'));
        links.forEach((link) => {
            expect(screen.getByText(link.label)).toBeInTheDocument();
        });
    });

    it('hides when closed', () => {
        render(<Wrapper><NavBarLinksGroup label="Group Label" initiallyOpened links={links} /></Wrapper>);
        const collapseElement = screen.getByTestId('collapse');
        expect(collapseElement).toHaveAttribute('aria-hidden', 'false');
        fireEvent.click(screen.getByText('Group Label'));
        expect(collapseElement).toHaveAttribute('aria-hidden', 'true');
    });
});

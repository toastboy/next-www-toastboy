import { render, screen } from '@testing-library/react';

import { DocsIndex } from '@/components/DocsIndex/DocsIndex';
import { Wrapper } from '@/tests/components/lib/common';

const docs = [
    {
        href: '/footy/docs/privacy',
        title: 'Privacy Notice',
        description: 'How we handle your data.',
    },
    {
        href: '/footy/docs/admin',
        title: 'Admin Documentation',
        description: 'Managing the site.',
    },
];

describe('DocsIndex', () => {
    it('renders the page heading', () => {
        render(
            <Wrapper>
                <DocsIndex docs={docs} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: 'Documentation' }),
        ).toBeInTheDocument();
    });

    it('renders a link and description for each document', () => {
        render(
            <Wrapper>
                <DocsIndex docs={docs} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('link', { name: 'Privacy Notice' }),
        ).toHaveAttribute('href', '/footy/docs/privacy');
        expect(
            screen.getByRole('link', { name: 'Admin Documentation' }),
        ).toHaveAttribute('href', '/footy/docs/admin');
        expect(
            screen.getByText('How we handle your data.'),
        ).toBeInTheDocument();
    });
});

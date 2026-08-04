import { render, screen } from '@testing-library/react';

import { Wrapper } from '@/tests/components/lib/common';

import { TableIndexList } from './TableIndexList';

const tables = [
    { name: 'Points', href: '/footy/table/points', description: 'The Blue Riband table: rewards both winning and attendance.' },
    { name: 'Averages', href: '/footy/table/averages', description: 'Best average points per game.' },
    { name: 'Stalwart', href: '/footy/table/stalwart', description: 'The one you win just by turning up.' },
    { name: 'Captain Speedy', href: '/footy/table/speedy', description: 'Rewards people for responding early to the call for players.' },
];

describe('TableIndexList', () => {
    it.each(tables)('renders a link and its matching description for $name', ({ name, href, description }) => {
        render(
            <Wrapper>
                <TableIndexList />
            </Wrapper>,
        );

        const link = screen.getByRole('link', { name });
        expect(link).toHaveAttribute('href', href);

        const listItem = link.closest('li');
        expect(listItem).not.toBeNull();
        expect(listItem).toHaveTextContent(description);
    });
});

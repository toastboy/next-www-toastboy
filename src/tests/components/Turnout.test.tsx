import { render, screen } from '@testing-library/react';

import Turnout from '@/components/Turnout/Turnout';
import { defaultTurnoutByYearList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('Turnout', () => {
    it('renders turnout table with data', () => {
        render(
            <Wrapper>
                <Turnout turnout={defaultTurnoutByYearList} />
            </Wrapper>,
        );

        expect(screen.getByText('Year')).toBeInTheDocument();
        expect(screen.getByText('Played')).toBeInTheDocument();
        expect(screen.getByText('Cancelled')).toBeInTheDocument();
        expect(screen.getByText('Response Rate')).toBeInTheDocument();
    });

    it('sorts by year descending', () => {
        render(
            <Wrapper>
                <Turnout turnout={defaultTurnoutByYearList} />
            </Wrapper>,
        );

        const rows = screen.getAllByRole('row');
        // First row is header, second row is most recent year (2004)
        expect(rows[1]).toHaveTextContent('2004');
    });
});

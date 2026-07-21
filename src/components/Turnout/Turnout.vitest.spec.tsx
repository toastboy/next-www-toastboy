import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Turnout } from '@/components/Turnout/Turnout';
import { config } from '@/lib/config';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultTurnoutByYearList } from '@/tests/mocks/data/turnoutByYear';
import { TurnoutByYearType } from '@/types';

const createMockTurnoutByYear = (overrides: Partial<TurnoutByYearType> = {}): TurnoutByYearType => ({
    year: 2000,
    gameDays: 50,
    gamesScheduled: 45,
    gamesInitiated: 45,
    gamesPlayed: 40,
    gamesCancelled: 5,
    responses: 400,
    yesses: 350,
    players: 340,
    responsesPerGameInitiated: 8.9,
    yessesPerGameInitiated: 7.8,
    playersPerGamePlayed: 8.5,
    ...overrides,
});

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

    describe('show more / show less', () => {
        const manyYears = Array.from(
            { length: config.tableVisibleRows + 5 },
            (_, index) => createMockTurnoutByYear({ year: 2000 + index }),
        );

        it('renders only the configured number of rows, with a "show more" toggle', () => {
            render(
                <Wrapper>
                    <Turnout turnout={manyYears} />
                </Wrapper>,
            );

            const [, tbody] = screen.getAllByRole('rowgroup');
            expect(within(tbody).getAllByRole('row')).toHaveLength(config.tableVisibleRows);
            expect(screen.getByRole('button', { name: 'Show 5 more' })).toBeInTheDocument();
        });

        it('reveals the remaining rows when the toggle is clicked, then hides them again', async () => {
            const user = userEvent.setup();
            render(
                <Wrapper>
                    <Turnout turnout={manyYears} />
                </Wrapper>,
            );

            await user.click(screen.getByRole('button', { name: 'Show 5 more' }));

            const [, tbody] = screen.getAllByRole('rowgroup');
            expect(within(tbody).getAllByRole('row')).toHaveLength(manyYears.length);
            const showLess = screen.getByRole('button', { name: 'Show less' });

            await user.click(showLess);

            expect(within(tbody).getAllByRole('row')).toHaveLength(config.tableVisibleRows);
        });

        it('does not render a toggle when all rows already fit', () => {
            render(
                <Wrapper>
                    <Turnout turnout={defaultTurnoutByYearList} />
                </Wrapper>,
            );

            expect(screen.queryByRole('button', { name: /show/i })).not.toBeInTheDocument();
        });

        it('keeps the headers visible', () => {
            render(
                <Wrapper>
                    <Turnout turnout={manyYears} />
                </Wrapper>,
            );

            expect(screen.getByRole('columnheader', { name: 'Year' })).toBeVisible();
        });
    });
});

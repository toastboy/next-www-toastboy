import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerHistory } from '@/components/PlayerHistory/PlayerHistory';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

describe('PlayerHistory', () => {

    it('renders year selector and child components with active years', async () => {
        render(
            <Wrapper>
                <PlayerHistory
                    player={defaultPlayer}
                    activeYears={[2020, 2021, 2022, 2023]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );


        // Find the year selector button (shows the current year)
        const yearSelectorButton = await screen.findByRole('button', { name: /2023/i });
        expect(yearSelectorButton).toBeInTheDocument();

        // Open the dropdown using userEvent
        await userEvent.click(yearSelectorButton);

        // Wait for the year options to appear as text
        expect((await screen.findAllByText('2023')).length).toBeGreaterThan(0);
        expect(screen.getAllByText('2020').length).toBeGreaterThan(0);
        expect(screen.getAllByText('2021').length).toBeGreaterThan(0);
        expect(screen.getAllByText('2022').length).toBeGreaterThan(0);

        // Results table: just get the first table and check for expected content
        const tables = screen.getAllByRole('table');
        expect(tables.length).toBeGreaterThanOrEqual(2);
        expect(within(tables[0]).getByText('Played')).toBeInTheDocument();
        expect(within(tables[0]).getByText('Won')).toBeInTheDocument();
        expect(within(tables[0]).getByText('Drawn')).toBeInTheDocument();
        expect(within(tables[0]).getByText('Lost')).toBeInTheDocument();

        // Positions table (by caption)
        expect(screen.getByRole('table', { name: /positions/i })).toBeInTheDocument();
    });

    it('handles no active years', () => {
        render(
            <Wrapper>
                <PlayerHistory
                    player={defaultPlayer}
                    activeYears={[]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        // The year selector button should still show the current year
        const yearSelectorButton = screen.getByRole('button', { name: /2023/i });
        expect(yearSelectorButton).toBeInTheDocument();

        // Results and positions tables should still be present
        const tables = screen.getAllByRole('table');
        expect(tables.length).toBeGreaterThanOrEqual(2);
        expect(within(tables[0]).getByText('Played')).toBeInTheDocument();
        expect(within(tables[0]).getByText('Won')).toBeInTheDocument();
        expect(within(tables[0]).getByText('Drawn')).toBeInTheDocument();
        expect(within(tables[0]).getByText('Lost')).toBeInTheDocument();
        expect(screen.getByRole('table', { name: /positions/i })).toBeInTheDocument();
    });
});

import { render, screen, within } from '@testing-library/react';

import { PlayerHistory } from '@/components/PlayerHistory/PlayerHistory';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

describe('PlayerHistory', () => {
    it('renders year selector and child components with active years', async () => {
        render(
            <Wrapper>
                <PlayerHistory
                    playerName={'Lionel Scruffy'}
                    activeYears={[2020, 2021, 2022, 2023]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const yearSelector = await screen.findByTestId('player-history-year-selector');
        const results = screen.getByTestId('player-history-results');
        const positions = screen.getByTestId('player-history-positions');

        expect(within(yearSelector).getByRole('button', { name: '2023' })).toBeInTheDocument();
        expect(within(yearSelector).getByRole('button', { name: '2020' })).toBeInTheDocument();
        expect(within(yearSelector).getByRole('button', { name: '2021' })).toBeInTheDocument();
        expect(within(yearSelector).getByRole('button', { name: '2022' })).toBeInTheDocument();
        expect(results).toBeInTheDocument();
        expect(positions).toBeInTheDocument();
    });

    it('handles no active years', () => {
        render(
            <Wrapper>
                <PlayerHistory
                    playerName={'Lionel Scruffy'}
                    activeYears={[]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        const yearSelector = screen.getByTestId('player-history-year-selector');
        const results = screen.getByTestId('player-history-results');
        const positions = screen.getByTestId('player-history-positions');

        expect(within(yearSelector).queryByRole('button', { name: '2023' })).not.toBeInTheDocument();
        expect(results).toBeInTheDocument();
        expect(positions).toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';

import { PlayerResults } from '@/components/PlayerResults/PlayerResults';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

describe('PlayerResults', () => {
    it('renders results table with data', () => {
        render(
            <Wrapper>
                <PlayerResults
                    playerName="Test Player"
                    year={2024}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Played')).toBeInTheDocument();
        expect(screen.getByText('Won')).toBeInTheDocument();
        expect(screen.getByText('Drawn')).toBeInTheDocument();
        expect(screen.getByText('Lost')).toBeInTheDocument();
    });

    it('renders dashes when record is null', () => {
        render(
            <Wrapper>
                <PlayerResults playerName="Test Player" year={2024} record={null} />
            </Wrapper>,
        );

        const dashes = screen.getAllByText('-');
        expect(dashes.length).toBeGreaterThan(0);
    });
});

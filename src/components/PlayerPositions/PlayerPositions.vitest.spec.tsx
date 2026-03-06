import { render, screen } from '@testing-library/react';

import { PlayerPositions } from '@/components/PlayerPositions/PlayerPositions';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

describe('PlayerPositions', () => {
    it('renders table with position rankings', () => {
        render(
            <Wrapper>
                <PlayerPositions
                    player={defaultPlayer}
                    year={2024}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/Positions/)).toBeInTheDocument();
    });

    it('renders dashes when record is null', () => {
        render(
            <Wrapper>
                <PlayerPositions player={defaultPlayer} year={2024} record={null} />
            </Wrapper>,
        );

        const dashes = screen.getAllByText('-');
        expect(dashes.length).toBeGreaterThan(0);
    });
});

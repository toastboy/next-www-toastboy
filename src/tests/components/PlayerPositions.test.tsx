import { render, screen } from '@testing-library/react';

import PlayerPositions from '@/components/PlayerPositions/PlayerPositions';
import { defaultPlayerRecord } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerPositions', () => {
    it('renders table with position rankings', () => {
        render(
            <Wrapper>
                <PlayerPositions
                    playerName="Test Player"
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
                <PlayerPositions playerName="Test Player" year={2024} record={null} />
            </Wrapper>,
        );

        const dashes = screen.getAllByText('-');
        expect(dashes.length).toBeGreaterThan(0);
    });
});

jest.mock('@/components/PlayerTrophyTally/PlayerTrophyTally');

import { render, screen } from '@testing-library/react';

import { PlayerTrophies } from '@/components/PlayerTrophies/PlayerTrophies';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultTrophiesList } from '@/tests/mocks';

describe('PlayerTrophies', () => {
    it('renders trophy tally for each table', () => {
        render(
            <Wrapper>
                <PlayerTrophies trophies={defaultTrophiesList} />
            </Wrapper>,
        );

        const tallies = screen.getAllByTestId('mock-player-trophy-tally');
        expect(tallies.length).toBeGreaterThan(0);
    });
});

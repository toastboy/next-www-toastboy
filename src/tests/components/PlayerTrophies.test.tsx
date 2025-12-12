jest.mock('components/PlayerTrophyTally/PlayerTrophyTally', () => {
    const MockPlayerTrophyTally = () => <div data-testid="mock-player-trophy-tally" />;
    MockPlayerTrophyTally.displayName = 'MockPlayerTrophyTally';
    return MockPlayerTrophyTally;
});

import { render, screen } from '@testing-library/react';

import PlayerTrophies from '@/components/PlayerTrophies/PlayerTrophies';
import { defaultTrophiesList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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

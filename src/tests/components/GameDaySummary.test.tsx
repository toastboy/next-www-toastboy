import { render, screen } from '@testing-library/react';

import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { defaultGameDay, defaultTeamPlayerList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

jest.mock('components/Team/Team', () => {
    const MockTeam = () => <div data-testid="mock-team" />;
    MockTeam.displayName = 'MockTeam';
    return { Team: MockTeam };
});

describe('GameDaySummary', () => {
    it('renders game title when game exists', () => {
        render(
            <Wrapper>
                <GameDaySummary
                    gameDay={defaultGameDay}
                    teamA={defaultTeamPlayerList}
                    teamB={defaultTeamPlayerList}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/Game 1:/)).toBeInTheDocument();
    });

    it('renders "No game" when game is false', () => {
        render(
            <Wrapper>
                <GameDaySummary
                    gameDay={{ ...defaultGameDay, game: false }}
                    teamA={[]}
                    teamB={[]}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/No game/i)).toBeInTheDocument();
    });
});

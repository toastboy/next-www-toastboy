jest.mock('components/TeamPlayer/TeamPlayer', () => {
    const MockTeamPlayer = () => <div data-testid="mock-team-player" />;
    MockTeamPlayer.displayName = 'MockTeamPlayer';
    return MockTeamPlayer;
});

import { render, screen } from '@testing-library/react';

import Team from '@/components/Team/Team';
import { defaultTeamPlayerList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('Team', () => {
    it('renders team players', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} />
            </Wrapper>,
        );

        const teamPlayers = screen.getAllByTestId('mock-team-player');
        expect(teamPlayers.length).toBe(defaultTeamPlayerList.length);
    });
});

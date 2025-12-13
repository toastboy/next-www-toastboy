jest.mock('@/components/TeamPlayer/TeamPlayer');

import { render, screen } from '@testing-library/react';

import { Team } from '@/components/Team/Team';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultTeamPlayerList } from '@/tests/mocks';

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

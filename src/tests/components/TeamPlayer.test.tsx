jest.mock('@/components/PlayerForm/PlayerForm');
jest.mock('@/components/PlayerLink/PlayerLink');
jest.mock('@/components/PlayerMugshot/PlayerMugshot');

import { render, screen } from '@testing-library/react';

import { TeamPlayer } from '@/components/TeamPlayer/TeamPlayer';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultTeamPlayer } from '@/tests/mocks';

describe('TeamPlayer', () => {
    it('renders team player with form and mugshot', () => {
        render(
            <Wrapper>
                <TeamPlayer teamPlayer={defaultTeamPlayer} />
            </Wrapper>,
        );

        expect(screen.getByTestId('mock-player-link')).toBeInTheDocument();
        expect(screen.getByTestId('mock-player-mugshot')).toBeInTheDocument();
        expect(screen.getByTestId('mock-player-form')).toBeInTheDocument();
    });

    it('displays goalie status when applicable', () => {
        const goalieTeamPlayer = {
            ...defaultTeamPlayer,
            outcome: { ...defaultTeamPlayer.outcome, goalie: true },
        };

        render(
            <Wrapper>
                <TeamPlayer teamPlayer={goalieTeamPlayer} />
            </Wrapper>,
        );

        expect(screen.getByText('GOALIE!')).toBeInTheDocument();
    });
});

jest.mock('@/components/PlayerForm/PlayerForm');
jest.mock('@/components/PlayerLink/PlayerLink');
jest.mock('@/components/PlayerMugshot/PlayerMugshot');

import { render, screen } from '@testing-library/react';

import { Props as PlayerLinkProps } from '@/components/PlayerLink/PlayerLink';
import { TeamPlayer } from '@/components/TeamPlayer/TeamPlayer';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultTeamPlayer } from '@/tests/mocks';

describe('TeamPlayer', () => {
    it('renders team player with form and mugshot', () => {
        render(
            <Wrapper>
                <TeamPlayer teamPlayer={defaultTeamPlayer} />
            </Wrapper>,
        );

        const props = extractMockProps<PlayerLinkProps>('PlayerLink');
        expect(props.length).toBe(1);
        expect(props[0].player.name).toEqual("Gary Player");
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

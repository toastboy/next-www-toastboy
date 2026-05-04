
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Team } from '@/components/Team/Team';
import { Props as TeamPlayerProps } from '@/components/TeamPlayer/TeamPlayer';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

vi.mock('@/components/TeamPlayer/TeamPlayer');

describe('Team', () => {
    it('renders team players', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} />
            </Wrapper>,
        );

        const props = extractMockProps<TeamPlayerProps>('TeamPlayer');
        expect(props.length).toBe(10);
        expect(props[0].teamPlayer.name).toEqual("Gary Player");
    });

    it('shows "Bibs" badge when hasBibs is true', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} hasBibs={true} />
            </Wrapper>,
        );

        expect(screen.getByText('Bibs')).toBeInTheDocument();
    });

    it('shows "Won" badge for result="win"', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} result="win" />
            </Wrapper>,
        );

        expect(screen.getByText('Won')).toBeInTheDocument();
    });

    it('shows "Lost" badge for result="loss"', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} result="loss" />
            </Wrapper>,
        );

        expect(screen.getByText('Lost')).toBeInTheDocument();
    });

    it('shows "Draw" badge for result="draw"', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} result="draw" />
            </Wrapper>,
        );

        expect(screen.getByText('Draw')).toBeInTheDocument();
    });

    it('shows "No players selected." when team is empty', () => {
        render(
            <Wrapper>
                <Team team={[]} />
            </Wrapper>,
        );

        expect(screen.getByText('No players selected.')).toBeInTheDocument();
    });
});

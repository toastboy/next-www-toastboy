jest.mock('swr');

import { render, screen } from '@testing-library/react';
import Team from 'components/Team';
import { FootyTeam } from 'lib/swr';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from './lib/common';

const gamedayId = 1000;
const team: FootyTeam = FootyTeam.A;

jest.mock('components/TeamPlayer', () => {
    const TeamPlayer = ({ idOrLogin, goalie }: { idOrLogin: string, goalie: boolean }) => (
        <div>TeamPlayer (idOrLogin: {idOrLogin}, goalie: {goalie.toString()})</div>
    );
    TeamPlayer.displayName = 'TeamPlayer';
    return TeamPlayer;
});

describe('Team', () => {
    it('renders loading state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><Team gameDayId={gamedayId} team={team} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><Team gameDayId={gamedayId} team={team} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Team gameDayId={gamedayId} team={team} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders table with data', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [
                {
                    "playerId": 1,
                    "goalie": true,
                    "team": "A",
                },
                {
                    "playerId": 2,
                    "goalie": false,
                    "team": "A",
                },
                {
                    "playerId": 3,
                    "goalie": false,
                    "team": "A",
                },
                {
                    "playerId": 4,
                    "goalie": false,
                    "team": "A",
                },
                {
                    "playerId": 5,
                    "goalie": false,
                    "team": "A",
                },
            ],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Team gameDayId={gamedayId} team={team} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.queryByText(errorText)).not.toBeInTheDocument();
        expect(screen.getByText('TeamPlayer (idOrLogin: 1, goalie: true)')).toBeInTheDocument();
    });
});

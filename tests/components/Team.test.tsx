jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import Team from 'components/Team/Team';
import { Outcome } from 'lib/types';
import { Wrapper, errorText, loaderClass } from './lib/common';

jest.mock('components/TeamPlayer/TeamPlayer');

describe('Team', () => {
    // TODO: Move test data to a common file
    const player = {
        id: 1,
        login: 'john_doe',
        name: 'John Doe',
        email: 'john.doe@example.com',
        born: new Date('1990-01-01'),
        isAdmin: null,
        firstName: "John",
        lastName: "Doe",
        anonymous: false,
        joined: null,
        finished: null,
        comment: null,
        introducedBy: null,
    };

    const outcome: Outcome = {
        id: 1,
        gameDayId: 1,
        playerId: 12,
        response: 'Yes',
        responseInterval: 1000,
        points: 3,
        team: 'A',
        comment: 'Test comment',
        pub: 1,
        paid: false,
        goalie: false,
        player: player,
    };

    const teamData = [
        {
            ...outcome,
            goalie: true,
            playerId: 1,
            player: {
                ...player,
                id: 1,
            },
        },
        {
            ...outcome,
            playerId: 2,
            player: {
                ...player,
                id: 2,
            },
        },
        {
            ...outcome,
            playerId: 3,
            player: {
                ...player,
                id: 3,
            },
        },
        {
            ...outcome,
            playerId: 4,
            player: {
                ...player,
                id: 4,
            },
        },
        {
            ...outcome,
            playerId: 5,
            player: {
                ...player,
                id: 5,
            },
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders table with data', async () => {
        const { container } = render(<Wrapper><Team team={teamData} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.queryByText(errorText)).not.toBeInTheDocument();
            expect(screen.getByText('TeamPlayer (id: 1, goalie: true)')).toBeInTheDocument();
        });
    });
});

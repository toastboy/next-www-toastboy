jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import GameDaySummary from 'components/GameDaySummary/GameDaySummary';
import { GameDay, Outcome, Player } from 'lib/types';
import { Wrapper, loaderClass } from "./lib/common";

jest.mock('components/GameDayLink/GameDayLink');
jest.mock('components/Team/Team');

describe('GameDaySummary', () => {
    // TODO: Move test data to a common file
    const player: Player = {
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

    const gameDay: GameDay = {
        id: 100,
        year: 2007,
        date: new Date('2007-01-02'),
        game: true,
        mailSent: new Date('2007-01-01'),
        comment: "",
        bibs: 'A',
        pickerGamesHistory: 10,
        outcomes: [
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
                playerId: 6,
                team: 'B',
                player: {
                    ...player,
                    id: 6,
                },
            },
            {
                ...outcome,
                playerId: 7,
                team: 'B',
                player: {
                    ...player,
                    id: 7,
                },
            },
            {
                ...outcome,
                playerId: 8,
                team: 'B',
                player: {
                    ...player,
                    id: 8,
                },
            },
            {
                ...outcome,
                playerId: 9,
                team: 'B',
                player: {
                    ...player,
                    id: 9,
                },
            },
            {
                ...outcome,
                playerId: 10,
                team: 'B',
                player: {
                    ...player,
                    id: 10,
                },
            },
            {
                ...outcome,
                playerId: 11,
                response: 'Dunno',
                team: null,
                player: {
                    ...player,
                    id: 11,
                },
            },
            {
                ...outcome,
                playerId: 12,
                response: 'No',
                team: null,
                player: {
                    ...player,
                    id: 12,
                },
            },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with data', async () => {
        const { container } = render(<Wrapper><GameDaySummary gameDay={gameDay} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("TeamPlayer (Player: 1, goalie: true)")).toBeInTheDocument();
            expect(screen.getByText("vs.")).toBeInTheDocument();
            expect(screen.getByText("TeamPlayer (Player: 6, goalie: false)")).toBeInTheDocument();
        });
    });

    it('renders with data + comment', async () => {
        const { container } = render(<Wrapper><GameDaySummary gameDay={{ ...gameDay, comment: "What a time to be alive" }} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("(What a time to be alive)")).toBeInTheDocument();
        });
    });

    it('renders with data (no game)', async () => {
        const { container } = render(<Wrapper><GameDaySummary gameDay={{ ...gameDay, game: false, comment: "Happy New Year" }} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("No game (Happy New Year)")).toBeInTheDocument();
        });
    });

    it('renders with data (no game, no comment)', async () => {
        const { container } = render(<Wrapper><GameDaySummary gameDay={{ ...gameDay, game: false }} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        });
    });
});

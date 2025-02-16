import { render, screen, waitFor } from '@testing-library/react';
import TableScore from 'components/TableScore/TableScore';
import { FootyTable } from 'lib/swr';
import { PlayerRecord } from 'lib/types';
import { Wrapper, loaderClass } from "./lib/common";

describe('TableScore', () => {
    const playerRecord: PlayerRecord = {
        id: 1,
        year: 2001,
        playerId: 1,
        gameDayId: 1,

        played: 10,
        won: 2,
        drawn: 4,
        lost: 4,

        points: 10,
        averages: 1.0,
        stalwart: 100,
        pub: 0,
        speedy: 2000,

        rankPoints: 4,
        rankAverages: 5,
        rankStalwart: 1,
        rankPub: 9,
        rankSpeedy: 3,

        rankAveragesUnqualified: 0,
        rankSpeedyUnqualified: 0,

        responses: 10,

        player: {
            id: 1,
            isAdmin: false,
            login: "derekt",
            firstName: "Derek",
            lastName: "Turnipson",
            name: "Derek Turnipson",
            email: "derek.turnipson@example.com",
            joined: new Date("2021-01-01"),
            finished: null,
            born: new Date("1975-11-01"),
            introducedBy: 23,
            comment: null,
            anonymous: false,
        },
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders correctly for points', async () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.points} playerRecord={playerRecord} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
        });
    });

    it('renders correctly for averages', async () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.averages} playerRecord={playerRecord} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("1.000")).toBeInTheDocument();
        });
    });

    it('renders correctly for speedy', async () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.speedy} playerRecord={playerRecord} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("00:33:20")).toBeInTheDocument();
        });
    });
});

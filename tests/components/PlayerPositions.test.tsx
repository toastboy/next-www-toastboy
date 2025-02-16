jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerPositions from 'components/PlayerPositions/PlayerPositions';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

describe('PlayerPositions', () => {
    const idOrLogin = "2";
    const year = 2021;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).toBeInTheDocument();
        });
    });

    it('renders error state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders error state when data is null', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data for year', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                year: 2021,
                playerId: 2,

                played: 10,
                won: 4,
                drawn: 3,
                lost: 3,

                points: 15,
                averages: 1.500,
                stalwart: 100,
                pub: 2,
                speedy: 5000,

                rankPoints: 4,
                rankAverages: 5,
                rankStalwart: 1,
                rankPub: 9,
                rankSpeedy: 3,
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
            },
            error: undefined,
            isLoading: false,
        });

        const { container: container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2021 Positions")).toBeInTheDocument();
            expect(screen.getByText("Points")).toBeInTheDocument();
            expect(screen.getByText("4")).toBeInTheDocument();
            expect(screen.getByText("Averages")).toBeInTheDocument();
            expect(screen.getByText("5")).toBeInTheDocument();
            expect(screen.getByText("Stalwart")).toBeInTheDocument();
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("Pub")).toBeInTheDocument();
            expect(screen.getByText("9")).toBeInTheDocument();
            expect(screen.getByText("Speedy")).toBeInTheDocument();
            expect(screen.getByText("3")).toBeInTheDocument();
        });
    });


    it('renders with data for year', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                year: 0,
                playerId: 2,

                played: 10,
                won: 4,
                drawn: 3,
                lost: 3,

                points: 15,
                averages: 1.500,
                stalwart: 100,
                pub: 2,
                speedy: 5000,

                rankPoints: 4,
                rankAverages: 5,
                rankStalwart: 1,
                rankPub: 9,
                rankSpeedy: 3,
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
            },
            error: undefined,
            isLoading: false,
        });

        const { container: container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={0} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("All-time Positions")).toBeInTheDocument();
            expect(screen.getByText("Points")).toBeInTheDocument();
            expect(screen.getByText("4")).toBeInTheDocument();
            expect(screen.getByText("Averages")).toBeInTheDocument();
            expect(screen.getByText("5")).toBeInTheDocument();
            expect(screen.getByText("Stalwart")).toBeInTheDocument();
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("Pub")).toBeInTheDocument();
            expect(screen.getByText("9")).toBeInTheDocument();
            expect(screen.getByText("Speedy")).toBeInTheDocument();
            expect(screen.getByText("3")).toBeInTheDocument();
        });
    });
});

jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerResults from 'components/PlayerResults/PlayerResults';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

describe('PlayerResults', () => {
    const idOrLogin = "11";
    const year = 2013;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerResults idOrLogin={idOrLogin} year={year} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerResults idOrLogin={idOrLogin} year={year} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerResults idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                year: 2013,
                playerId: 11,

                played: 10,
                won: 4,
                drawn: 5,
                lost: 1,

                points: 17,
                averages: 1.700,
                stalwart: 100,
                pub: 2,
                speedy: 5000,

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

        const { container } = render(<Wrapper><PlayerResults idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("Played")).toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
            expect(screen.getByText("Won")).toBeInTheDocument();
            expect(screen.getByText("4")).toBeInTheDocument();
            expect(screen.getByText("Drawn")).toBeInTheDocument();
            expect(screen.getByText("5")).toBeInTheDocument();
            expect(screen.getByText("Lost")).toBeInTheDocument();
            expect(screen.getByText("1")).toBeInTheDocument();
        });
    });
});

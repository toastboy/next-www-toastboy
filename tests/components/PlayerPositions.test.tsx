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
                year: 2022,
                playerId: 2,
                name: "Derek Turnipson",

                P: 10,
                W: 4,
                D: 3,
                L: 3,

                points: 15,
                averages: 1.500,
                stalwart: 100,
                pub: 2,
                speedy: 5000,

                rank_points: 4,
                rank_averages: 5,
                rank_stalwart: 1,
                rank_pub: 9,
                rank_speedy: 3,
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
                name: "Derek Turnipson",

                P: 10,
                W: 4,
                D: 3,
                L: 3,

                points: 15,
                averages: 1.500,
                stalwart: 100,
                pub: 2,
                speedy: 5000,

                rank_points: 4,
                rank_averages: 5,
                rank_stalwart: 1,
                rank_pub: 9,
                rank_speedy: 3,
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

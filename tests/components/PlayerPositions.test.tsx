import { render, screen } from '@testing-library/react';
import PlayerPositions from 'components/PlayerPositions';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayerRecord } from 'lib/swr';

jest.mock('lib/swr');

describe('PlayerPositions', () => {
    const idOrLogin = "2";
    const year = 2021;

    it('renders loading state', () => {
        (usePlayerRecord as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerRecord as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerRecord as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerRecord as jest.Mock).mockReturnValue({
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

        const { container } = render(<Wrapper><PlayerPositions idOrLogin={idOrLogin} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2021 Positions")).toBeInTheDocument();
        // TODO: Add more assertions
    });
});

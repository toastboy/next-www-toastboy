jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerResults from 'components/PlayerResults';
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
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerResults idOrLogin={idOrLogin} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2013 Results")).toBeInTheDocument();
        });
    });
});

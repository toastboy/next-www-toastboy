jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import TableQualified from 'components/TableQualified/TableQualified';
import { TableName } from 'lib/types';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('components/PlayerLink/PlayerLink');
jest.mock('components/TableScore/TableScore');

describe('TableQualified', () => {
    const table: TableName = "points";
    const year = 2002;
    const qualified = true;
    const take = 5;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
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

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
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

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: Array.from({ length: 15 }, (_, index) => ({
                year: 2001,
                playerId: index + 1,
                name: "Derek Turnipson",

                played: 15,
                won: 15 - index,
                drawn: 0,
                lost: index,

                points: 3 * (15 - index),
                averages: (3 * (15 - index)) / 15.0,
                stalwart: 100,
                pub: 0,
                speedy: 2000,
            })),
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("PlayerLink (idOrLogin: 1)")).toBeInTheDocument();
            expect(screen.getByText("TableScore (table: points, playerRecord.playerId: 1)")).toBeInTheDocument();
            expect(screen.getByText("PlayerLink (idOrLogin: 2)")).toBeInTheDocument();
            expect(screen.getByText("TableScore (table: points, playerRecord.playerId: 2)")).toBeInTheDocument();
            expect(screen.getByText("PlayerLink (idOrLogin: 3)")).toBeInTheDocument();
            expect(screen.getByText("TableScore (table: points, playerRecord.playerId: 3)")).toBeInTheDocument();
            expect(screen.getByText("PlayerLink (idOrLogin: 4)")).toBeInTheDocument();
            expect(screen.getByText("TableScore (table: points, playerRecord.playerId: 4)")).toBeInTheDocument();
        });
    });
});

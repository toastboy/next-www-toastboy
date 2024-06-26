import { render, screen } from '@testing-library/react';
import TableQualified from 'components/TableQualified';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { FootyPlayerRecord, FootyTable, useTable } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/PlayerLink', () => {
    const PlayerLink = ({ idOrLogin }: { idOrLogin: string }) => (
        <div>PlayerLink (idOrLogin: {idOrLogin})</div>
    );
    PlayerLink.displayName = 'PlayerLink';
    return PlayerLink;
});
jest.mock('components/TableScore', () => {
    const TableScore = ({ table, playerRecord }: { table: FootyTable, playerRecord: FootyPlayerRecord }) => (
        <div>TableScore (table: {table}, playerRecord.playerId: {playerRecord.playerId})</div>
    );
    TableScore.displayName = 'TableScore';
    return TableScore;
});

describe('TableQualified', () => {
    const table = FootyTable.points;
    const year = 2002;
    const qualified = true;
    const take = 5;

    it('renders loading state', () => {
        (useTable as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useTable as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useTable as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><TableQualified table={table} year={year} qualified={qualified} take={take} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (useTable as jest.Mock).mockReturnValue({
            data: Array.from({ length: 15 }, (_, index) => ({
                year: 2001,
                playerId: index + 1,
                name: "Derek Turnipson",

                P: 15,
                W: 15 - index,
                D: 0,
                L: index,

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
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("TableScore (table: points, playerRecord.playerId: 1)")).toBeInTheDocument();
        // TODO: more assertions
    });
});

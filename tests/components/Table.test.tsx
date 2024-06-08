import { render, screen } from '@testing-library/react';
import Table from 'components/Table';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { FootyTable, useGameYear } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/TableQualified', () => {
    const TableQualified = ({ table, year }: { table: FootyTable, year: number }) => (
        <div>TableQualified (table: {table}, year: {year})</div>
    );
    TableQualified.displayName = 'TableQualified';
    return TableQualified;
});

describe('Table', () => {
    const table = FootyTable.points;
    const year = 2010;

    it('renders loading state', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (useGameYear as jest.Mock).mockReturnValue({
            data: true,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2010 Points Table")).toBeInTheDocument();
        expect(screen.getByText("TableQualified (table: points, year: 2010)")).toBeInTheDocument();
    });
});

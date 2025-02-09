jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import Table from 'components/Table/Table';
import { FootyTable } from 'lib/swr';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('components/TableQualified/TableQualified');

describe('Table', () => {
    const table = FootyTable.points;
    const year = 2010;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
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

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
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

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders points table with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={table} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2010 Points Table")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: points, year: 2010, qualified: false)")).toBeInTheDocument();
        });
    });

    it('renders averages table with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.averages} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2010 Averages Table")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: averages, year: 2010, qualified: true)")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: averages, year: 2010, qualified: false)")).toBeInTheDocument();
        });
    });

    it('renders stalwart table with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.stalwart} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2010 Stalwart Standings")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: stalwart, year: 2010, qualified: false)")).toBeInTheDocument();
        });
    });

    it('renders speedy table with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.speedy} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2010 Captain Speedy")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: speedy, year: 2010, qualified: true)")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: speedy, year: 2010, qualified: false)")).toBeInTheDocument();
        });
    });

    it('renders pub table with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: 2010,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><Table table={FootyTable.pub} year={year} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2010 Pub Table")).toBeInTheDocument();
            expect(screen.getByText("TableQualified (table: pub, year: 2010, qualified: false)")).toBeInTheDocument();
        });
    });
});

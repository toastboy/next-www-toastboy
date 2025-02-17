jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import WinnersTable from 'components/WinnersTable/WinnersTable';
import { TableName } from 'lib/types';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from './lib/common';

const table: TableName = "points";

jest.mock('components/PlayerLink/PlayerLink');

describe('WinnersTable', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
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

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
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

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders table with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [
                {
                    "year": 2023,
                    "playerId": 12,
                },
                {
                    "year": 2022,
                    "playerId": 1,
                },
                {
                    "year": 2021,
                    "playerId": 1,
                },
            ],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} year={0} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.queryByText(errorText)).not.toBeInTheDocument();
            expect(screen.getByText('PlayerLink (idOrLogin: 12)')).toBeInTheDocument();
        });
    });

    it('renders table for a single year', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [
                {
                    "year": 2022,
                    "playerId": 1,
                },
            ],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} year={2022} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.queryByText(errorText)).not.toBeInTheDocument();
            expect(screen.getByText('PlayerLink (idOrLogin: 1)')).toBeInTheDocument();
        });
    });
});

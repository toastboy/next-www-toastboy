import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import { FootyTable } from 'lib/swr';
import React, { ReactNode } from 'react';
import useSWR from 'swr';
import WinnersTable from './WinnersTable';

const table = FootyTable.points;
const year = 2021;

interface WinnersTableProps {
    children?: ReactNode;
}

const Wrapper: React.FC<WinnersTableProps> = ({ children }) => {
    return (
        <MantineProvider>
            {children}
        </MantineProvider>
    );
};

jest.mock('swr');

describe('WinnersTable', () => {
    it('renders loading state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} year={year} /></Wrapper>);
        expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error('failed to load'),
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} year={year} /></Wrapper>);
        expect(container.querySelector('.mantine-Loader-root')).not.toBeInTheDocument();
        expect(screen.getByText('failed to load')).toBeInTheDocument();
    });

    it('renders table with data', () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [
                {
                    "year": 2023,
                    "responses": 48,
                    "P": 39,
                    "W": 19,
                    "D": 1,
                    "L": 19,
                    "points": 58,
                    "averages": 1.487179487179487,
                    "stalwart": 98,
                    "pub": 1,
                    "rank_points": 1,
                    "rank_averages": 8,
                    "rank_averages_unqualified": null,
                    "rank_stalwart": 1,
                    "rank_speedy": 3,
                    "rank_speedy_unqualified": null,
                    "rank_pub": 1,
                    "speedy": 28607,
                    "playerId": 12,
                    "gameDayId": 1137,
                },
                {
                    "year": 2022,
                    "responses": 11,
                    "P": 9,
                    "W": 4,
                    "D": 2,
                    "L": 3,
                    "points": 14,
                    "averages": 1.555555555555556,
                    "stalwart": 100,
                    "pub": null,
                    "rank_points": 1,
                    "rank_averages": null,
                    "rank_averages_unqualified": 9,
                    "rank_stalwart": 1,
                    "rank_speedy": 4,
                    "rank_speedy_unqualified": null,
                    "rank_pub": null,
                    "speedy": 30189,
                    "playerId": 191,
                    "gameDayId": 1085,
                },
                {
                    "year": 2021,
                    "responses": 10,
                    "P": 6,
                    "W": 6,
                    "D": 0,
                    "L": 0,
                    "points": 18,
                    "averages": 3,
                    "stalwart": 75,
                    "pub": null,
                    "rank_points": 1,
                    "rank_averages": null,
                    "rank_averages_unqualified": 1,
                    "rank_stalwart": 5,
                    "rank_speedy": 5,
                    "rank_speedy_unqualified": null,
                    "rank_pub": null,
                    "speedy": 47148,
                    "playerId": 30,
                    "gameDayId": 1028,
                },
            ],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} year={year} /></Wrapper>);
        console.log(container.innerHTML);
        expect(container.querySelector('.mantine-loader')).not.toBeInTheDocument();
        expect(screen.queryByText('failed to load')).not.toBeInTheDocument();
    });
});

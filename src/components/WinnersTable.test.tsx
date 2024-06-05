import { MantineProvider } from '@mantine/core';
import { render, screen } from '@testing-library/react';
import WinnersTable from 'components/WinnersTable';
import { FootyTable, usePlayer, useWinners } from 'lib/swr';
import React, { ReactNode } from 'react';

const table = FootyTable.points;

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

jest.mock('lib/swr');

describe('WinnersTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (usePlayer as jest.Mock).mockReturnValue({
            data: {
                "id": 1,
                "login": "player1",
                "name": "Derek Turnipson",
            },
            error: undefined,
            isLoading: false,
        });
    });

    it('renders loading state', () => {
        (useWinners as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useWinners as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error('failed to load'),
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector('.mantine-Loader-root')).not.toBeInTheDocument();
        expect(screen.getByText('failed to load')).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useWinners as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector('.mantine-Loader-root')).not.toBeInTheDocument();
        expect(screen.getByText('failed to load')).toBeInTheDocument();
    });

    it('renders table with data', () => {
        (useWinners as jest.Mock).mockReturnValue({
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

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector('.mantine-Loader-root')).not.toBeInTheDocument();
        expect(screen.queryByText('failed to load')).not.toBeInTheDocument();
    });
});

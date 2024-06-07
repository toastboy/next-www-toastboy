import { render, screen } from '@testing-library/react';
import WinnersTable from 'components/WinnersTable';
import { FootyTable, useWinners } from 'lib/swr';
import { Wrapper, errorText, loaderClass } from './lib/common';

const table = FootyTable.points;

jest.mock('lib/swr');
jest.mock('components/PlayerLink', () => {
    const PlayerLink = ({ idOrLogin }: { idOrLogin: string }) => (
        <div>PlayerLink (idOrLogin: {idOrLogin})</div>
    );
    PlayerLink.displayName = 'PlayerLink';
    return PlayerLink;
});

describe('WinnersTable', () => {
    it('renders loading state', () => {
        (useWinners as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useWinners as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useWinners as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><WinnersTable table={table} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
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
        console.log(container.innerHTML);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.queryByText(errorText)).not.toBeInTheDocument();
        expect(screen.getByText('PlayerLink (idOrLogin: 12)')).toBeInTheDocument();
    });
});

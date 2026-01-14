import { render, screen, within } from '@testing-library/react';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { usePlayers } from '@/lib/swr';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';

import { Wrapper } from './lib/common';

jest.mock('@/lib/swr', () => ({
    usePlayers: jest.fn(),
}));

describe('AdminPlayerList', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders player rows with roles', () => {
        (usePlayers as jest.Mock).mockReturnValue([
            createMockPlayerData({ id: 1, name: 'Alex Admin', isAdmin: true }),
            createMockPlayerData({ id: 2, name: 'Pat Player', isAdmin: false }),
        ]);

        render(
            <Wrapper>
                <AdminPlayerList />
            </Wrapper>,
        );

        const table = screen.getByRole('table');
        expect(screen.getByTestId('admin-player-list-count')).toHaveTextContent('Players (2)');
        expect(within(table).getByText('Alex Admin')).toBeInTheDocument();
        expect(within(table).getByText('Pat Player')).toBeInTheDocument();
        expect(within(table).getByText('Admin')).toBeInTheDocument();
        expect(within(table).getByText('Player')).toBeInTheDocument();
    });

    it('renders empty state', () => {
        (usePlayers as jest.Mock).mockReturnValue([]);

        render(
            <Wrapper>
                <AdminPlayerList />
            </Wrapper>,
        );

        expect(screen.getByText('No players found.')).toBeInTheDocument();
    });
});

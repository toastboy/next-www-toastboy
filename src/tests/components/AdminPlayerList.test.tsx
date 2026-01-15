import { render, screen, within } from '@testing-library/react';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';

import { Wrapper } from './lib/common';

describe('AdminPlayerList', () => {
    it('renders player rows with roles', () => {
        const players = [
            createMockPlayerData({ id: 1, name: 'Alex Admin', isAdmin: true, accountEmail: 'alex@example.com' }),
            createMockPlayerData({
                id: 2,
                name: 'Pat Player',
                isAdmin: false,
                accountEmail: null,
                extraEmails: [
                    {
                        id: 2,
                        playerId: 2,
                        email: 'pat@example.com',
                        verifiedAt: null,
                        createdAt: new Date('2021-01-01'),
                    },
                ],
            }),
        ];

        render(
            <Wrapper>
                <AdminPlayerList players={players} />
            </Wrapper>,
        );

        const table = screen.getByRole('table');
        expect(screen.getByTestId('admin-player-list-count')).toHaveTextContent('Players (2)');
        expect(within(table).getAllByRole('checkbox').length).toBeGreaterThan(0);
        expect(within(table).getByText('Alex Admin')).toBeInTheDocument();
        expect(within(table).getByText('Pat Player')).toBeInTheDocument();
        expect(within(table).getByText('Admin')).toBeInTheDocument();
        expect(within(table).getByText('Player')).toBeInTheDocument();
        expect(within(table).getAllByText('Yes').length).toBeGreaterThan(0);
        expect(within(table).getAllByText('No').length).toBeGreaterThan(0);
    });

    it('renders empty state', () => {
        render(
            <Wrapper>
                <AdminPlayerList players={[]} />
            </Wrapper>,
        );

        expect(screen.getByText('No players found.')).toBeInTheDocument();
    });
});

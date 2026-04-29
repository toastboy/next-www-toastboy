import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';
import { AddPlayerInviteProxy } from '@/types/actions/CreatePlayer';
import { SendEmailProxy } from '@/types/actions/SendEmail';

const defaultAddPlayerProxy: AddPlayerInviteProxy = async (playerId, email) => {
    return Promise.resolve(`Invite link for player ${playerId} sent to ${email}`);
};

const stubSendEmail: SendEmailProxy = async (_mailOptions) => {
    return Promise.resolve();
};

describe('AdminPlayerList', () => {
    it('renders player rows with auth status', () => {
        const players = [
            createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            createMockPlayerData({
                id: 2,
                name: 'Pat Player',
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
                <AdminPlayerList
                    players={players}
                    userEmails={['alex@example.com']}
                    onAddPlayerInvite={defaultAddPlayerProxy}
                    onSendEmail={stubSendEmail}
                />
            </Wrapper>,
        );

        const table = screen.getByRole('table');
        expect(screen.getByTestId('admin-player-list-count')).toHaveTextContent('Players (2)');
        expect(within(table).getAllByRole('checkbox').length).toBeGreaterThan(0);
        expect(within(table).getByText('Alex Admin')).toBeInTheDocument();
        expect(within(table).getByText('Pat Player')).toBeInTheDocument();
        expect(within(table).getAllByText('Yes').length).toBeGreaterThan(0);
        expect(within(table).getAllByText('No').length).toBeGreaterThan(0);
    });


    it('copes with undefined userEmails', () => {
        render(
            <Wrapper>
                <AdminPlayerList
                    players={[]}
                    userEmails={undefined}
                    onAddPlayerInvite={defaultAddPlayerProxy}
                    onSendEmail={stubSendEmail}
                />
            </Wrapper>,
        );

        expect(screen.getByText('No players found.')).toBeInTheDocument();
    });

    it('renders empty state', () => {
        render(
            <Wrapper>
                <AdminPlayerList
                    players={[]}
                    userEmails={[]}
                    onAddPlayerInvite={defaultAddPlayerProxy}
                    onSendEmail={stubSendEmail}
                />
            </Wrapper>,
        );

        expect(screen.getByText('No players found.')).toBeInTheDocument();
    });

    it('filters players by name', () => {
        const players = [
            createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            createMockPlayerData({ id: 2, name: 'Pat Player', accountEmail: 'pat@example.com' }),
            createMockPlayerData({ id: 3, name: 'Sam Support', accountEmail: 'sam@example.com' }),
        ];

        render(
            <Wrapper>
                <AdminPlayerList
                    players={players}
                    userEmails={['alex@example.com']}
                    onAddPlayerInvite={defaultAddPlayerProxy}
                    onSendEmail={stubSendEmail}
                />
            </Wrapper>,
        );

        // The filter input should be present
        const filterInput = screen.getByPlaceholderText(/filter/i);
        expect(filterInput).toBeInTheDocument();

        fireEvent.change(filterInput, { target: { value: 'Pat' } });

        // Only Pat Player should be visible
        expect(screen.getByText('Pat Player')).toBeInTheDocument();
        expect(screen.queryByText('Alex Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Sam Support')).not.toBeInTheDocument();
    });

    it('onboards a selected player by calling onAddPlayerInvite then onSendEmail', async () => {
        const players = [
            createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
        ];
        const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
        const onSendEmail = vi.fn().mockResolvedValue(undefined);

        render(
            <Wrapper>
                <AdminPlayerList
                    players={players}
                    userEmails={[]}
                    onAddPlayerInvite={onAddPlayerInvite}
                    onSendEmail={onSendEmail}
                />
            </Wrapper>,
        );

        fireEvent.click(screen.getByRole('checkbox', { name: 'Select Alex Admin' }));
        fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

        await waitFor(() => {
            expect(onAddPlayerInvite).toHaveBeenCalledWith(1, 'alex@example.com');
            expect(onSendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'alex@example.com' }));
        });
    });
});

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

    describe('select all', () => {
        it('checks all player rows when select-all is clicked', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
                createMockPlayerData({ id: 2, name: 'Pat Player' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));

            expect(screen.getByRole('checkbox', { name: 'Select Alex Admin' })).toBeChecked();
            expect(screen.getByRole('checkbox', { name: 'Select Pat Player' })).toBeChecked();
        });

        it('deselects all rows when select-all is unchecked', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
                createMockPlayerData({ id: 2, name: 'Pat Player' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));

            expect(screen.getByRole('checkbox', { name: 'Select Alex Admin' })).not.toBeChecked();
            expect(screen.getByRole('checkbox', { name: 'Select Pat Player' })).not.toBeChecked();
        });

        it('select-all only covers the filtered subset', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
                createMockPlayerData({ id: 2, name: 'Pat Player' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.change(screen.getByPlaceholderText(/filter/i), { target: { value: 'Pat' } });
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));

            expect(screen.getByRole('checkbox', { name: 'Select Pat Player' })).toBeChecked();
        });
    });

    describe('sorting', () => {
        it('sorts by name ascending when Name header is clicked', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Zara' }),
                createMockPlayerData({ id: 2, name: 'Alice' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Zara')).toBeInTheDocument();
        });

        it('reverses to descending on a second click of the same column header', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Zara' }),
                createMockPlayerData({ id: 2, name: 'Alice' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Zara')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Alice')).toBeInTheDocument();
        });
    });

    describe('impersonate button', () => {
        it('is disabled when player has no matching userId', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        userIdByEmail={{}}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            expect(screen.getByRole('button', { name: 'Impersonate' })).toBeDisabled();
        });

        it('is enabled when player has a matching userId', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        userIdByEmail={{ 'alex@example.com': 'user-abc-123' }}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            expect(screen.getByRole('button', { name: 'Impersonate' })).toBeEnabled();
        });
    });

    describe('emails verified column', () => {
        it('shows "Yes" when all extra emails are verified', () => {
            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Alex Admin',
                    accountEmail: null,
                    extraEmails: [{
                        id: 1,
                        playerId: 1,
                        email: 'alex@example.com',
                        verifiedAt: new Date('2021-01-01'),
                        createdAt: new Date('2021-01-01'),
                    }],
                }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            const table = screen.getByRole('table');
            expect(within(table).getByText('Yes')).toBeInTheDocument();
        });

        it('shows "No" when an extra email is unverified', () => {
            // accountEmail is in userEmails so Auth = "Yes"; unverified extra email → Emails Verified = "No"
            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Pat Player',
                    accountEmail: 'pat@example.com',
                    extraEmails: [{
                        id: 1,
                        playerId: 1,
                        email: 'pat@example.com',
                        verifiedAt: null,
                        createdAt: new Date('2021-01-01'),
                    }],
                }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={['pat@example.com']}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            const table = screen.getByRole('table');
            expect(within(table).getByText('Yes')).toBeInTheDocument(); // Auth
            expect(within(table).getByText('No')).toBeInTheDocument(); // Emails Verified
        });

        it('shows empty cell when player has no extra emails', () => {
            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Sam Support',
                    accountEmail: 'sam@example.com',
                    extraEmails: [],
                }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={['sam@example.com']}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            const table = screen.getByRole('table');
            // Auth column shows "Yes"; emails-verified cell should be empty (no Yes/No for it)
            const yesCells = within(table).getAllByText('Yes');
            expect(yesCells).toHaveLength(1); // only the Auth column
        });
    });

    describe('auth status', () => {
        it('matches email case-insensitively', () => {
            // No extra emails so only Auth column produces Yes/No
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'Alex@Example.COM', extraEmails: [] }),
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
            expect(within(table).getByText('Yes')).toBeInTheDocument();
        });
    });
});

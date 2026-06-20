import { notifications } from '@mantine/notifications';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import {
    compareNullableNumber,
    compareNullableString,
    comparePlayers,
    getImpersonationLabel,
    getPreferredEmail,
    type SortKey,
} from '@/lib/adminPlayer';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerData } from '@/tests/mocks/data/playerData';
import { AddPlayerInviteProxy } from '@/types/actions/CreatePlayer';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

const { mockRefresh } = vi.hoisted(() => ({
    mockRefresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: mockRefresh }),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

const defaultAddPlayerProxy: AddPlayerInviteProxy = async (playerId, email) => {
    return Promise.resolve(`Invite link for player ${playerId} sent to ${email}`);
};

const stubSendEmail: SendEmailProxy = async (_mailOptions) => {
    return Promise.resolve();
};

describe('AdminPlayerList', () => {
    beforeEach(() => {
        vi.spyOn(notifications, 'show').mockReturnValue('notification-id');
        vi.spyOn(notifications, 'update').mockImplementation(() => 'notification-id');
        mockRefresh.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders loading state when players are not yet available', () => {
        render(
            <Wrapper>
                <AdminPlayerList
                    players={undefined as never}
                    userEmails={[]}
                    onAddPlayerInvite={defaultAddPlayerProxy}
                    onSendEmail={stubSendEmail}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Loading players...')).toBeInTheDocument();
    });

    it('renders player rows with auth status', () => {
        const players = [
            createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            createMockPlayerData({
                id: 2,
                name: 'Pat Player',
                accountEmail: null,
                extraEmails: [
                    { email: 'pat@example.com', verified: false },
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
        expect(screen.getByText('Players (2)')).toBeInTheDocument();
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

        it('unchecks a row when its checkbox is clicked while checked', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
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

            const checkbox = screen.getByRole('checkbox', { name: 'Select Alex Admin' });
            fireEvent.click(checkbox); // check
            expect(checkbox).toBeChecked();
            fireEvent.click(checkbox); // uncheck
            expect(checkbox).not.toBeChecked();
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

        it('toggles back to ascending on a third click of the same column header', () => {
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' })); // asc
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' })); // desc
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' })); // back to asc

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

        it('sorts by Joined — null dates sort last', () => {
            // Player A has a joined date, Player B does not → A appears first (asc)
            const players = [
                createMockPlayerData({ id: 2, name: 'Bob', joined: null }),
                createMockPlayerData({ id: 1, name: 'Alice', joined: new Date('2020-01-01') }),
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Joined' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
        });

        it('sorts by Auth — authenticated players first', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Anonymous', accountEmail: null, extraEmails: [] }),
                createMockPlayerData({ id: 2, name: 'Authed', accountEmail: 'authed@example.com', extraEmails: [] }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={['authed@example.com']}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            // Default sort is ID; switch to Auth asc (unauthenticated = 0 comes first)
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Auth' }));
            const rowsAsc = screen.getAllByRole('row').slice(1);
            expect(within(rowsAsc[0]).getByText('Anonymous')).toBeInTheDocument();

            // Reverse to desc (authenticated = 1 comes first)
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Auth' }));
            const rowsDesc = screen.getAllByRole('row').slice(1);
            expect(within(rowsDesc[0]).getByText('Authed')).toBeInTheDocument();
        });

        it('sorts by Finished — null dates sort last', () => {
            const players = [
                createMockPlayerData({ id: 2, name: 'Bob', finished: null }),
                createMockPlayerData({ id: 1, name: 'Alice', finished: new Date('2020-01-01') }),
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Finished' }));

            const rows = screen.getAllByRole('row').slice(1);
            // Alice (has finished date) first; Bob (null) last
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
        });

        it('sorts by Joined descending with both players having non-null join dates', () => {
            // Both non-null → covers the truthy branch of b.joined ternary (line 521)
            // Players array order controls which is `a` vs `b` in the V8 2-element sort
            const players = [
                createMockPlayerData({ id: 1, name: 'Alice', joined: new Date('2020-01-01') }),
                createMockPlayerData({ id: 2, name: 'Bob', joined: new Date('2023-06-01') }),
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Joined' }));
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Joined' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Bob')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Alice')).toBeInTheDocument();
        });

        it('sorts by Finished descending with both players having non-null finish dates', () => {
            // Both non-null → covers the truthy branch of b.finished ternary (line 527)
            const players = [
                createMockPlayerData({ id: 1, name: 'Alice', finished: new Date('2020-01-01') }),
                createMockPlayerData({ id: 2, name: 'Bob', finished: new Date('2023-06-01') }),
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Finished' }));
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Finished' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Bob')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Alice')).toBeInTheDocument();
        });

        it('sorts by Auth with onboarded player at array index 0', () => {
            // Flipping order from the other auth test covers the opposite branches:
            // isOnboarded(a) falsy (line 532) and isOnboarded(b) truthy (line 533)
            const players = [
                createMockPlayerData({ id: 1, name: 'Authed', accountEmail: 'authed@example.com', extraEmails: [] }),
                createMockPlayerData({ id: 2, name: 'Anonymous', accountEmail: null, extraEmails: [] }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={['authed@example.com']}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Auth' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Anonymous')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Authed')).toBeInTheDocument();
        });

        it('sorts by Emails Verified with both players having extra emails (one verified, one not)', () => {
            // Both players have extraEmails → covers b.extraEmails.length > 0 truthy (line 539)
            // a has unverified → covers a.extraEmails.every falsy (line 538 inner)
            // b has verified → covers b.extraEmails.every truthy (line 539 inner)
            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Bob',
                    extraEmails: [{ email: 'bob@example.com', verified: true }],
                }),
                createMockPlayerData({
                    id: 2,
                    name: 'Alice',
                    extraEmails: [{ email: 'alice@example.com', verified: false }],
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Emails Verified' }));

            const rows = screen.getAllByRole('row').slice(1);
            // Ascending: unverified (0) before verified (1) → Alice first
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
        });

        it('sorts by Emails Verified — null (no extra emails) sorts last', () => {
            const players = [
                createMockPlayerData({ id: 2, name: 'Bob', extraEmails: [] }),
                createMockPlayerData({
                    id: 1,
                    name: 'Alice',
                    extraEmails: [{ email: 'alice@example.com', verified: true }],
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Emails Verified' }));

            const rows = screen.getAllByRole('row').slice(1);
            // null (Bob, no emails) sorts last; Alice (verified) sorts first
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
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
                    extraEmails: [{ email: 'alex@example.com', verified: true }],
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
                    extraEmails: [{ email: 'pat@example.com', verified: false }],
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

    describe('onboard button', () => {
        it('skips and reports when selected player has no email address', async () => {
            const onAddPlayerInvite = vi.fn();
            const onSendEmail = vi.fn().mockResolvedValue(undefined);
            const players = [
                createMockPlayerData({ id: 1, name: 'No Email Player', accountEmail: null, extraEmails: [] }),
            ];

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

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select No Email Player' }));
            fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

            await waitFor(() => {
                expect(onAddPlayerInvite).not.toHaveBeenCalled();
            });

            expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                id: 'notification-id',
                title: 'Onboarding sent',
                message: 'Invites: 0 sent. 1 skipped.',
            }));
        });

        it('is disabled before any player is selected', () => {
            render(
                <Wrapper>
                    <AdminPlayerList
                        players={[createMockPlayerData({ id: 1, name: 'Alex Admin' })]}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            expect(screen.getByRole('button', { name: 'Onboard player' })).toBeDisabled();
        });

        it('remains enabled after a player is selected', () => {
            render(
                <Wrapper>
                    <AdminPlayerList
                        players={[createMockPlayerData({ id: 1, name: 'Alex Admin' })]}
                        userEmails={[]}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Alex Admin' }));

            expect(screen.getByRole('button', { name: 'Onboard player' })).toBeEnabled();
        });

        it('uses unverified extra email as fallback when no verified email exists', async () => {
            // Covers the verifiedEmail ?? extraEmails[0] nullish-coalescing falsy branch (line 559)
            const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
            const onSendEmail = vi.fn().mockResolvedValue(undefined);

            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Pat Player',
                    accountEmail: null,
                    extraEmails: [{ email: 'pat-unverified@example.com', verified: false }],
                }),
            ];

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

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Pat Player' }));
            fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

            await waitFor(() => {
                expect(onAddPlayerInvite).toHaveBeenCalledWith(1, 'pat-unverified@example.com');
            });
        });

        it('uses extra email as fallback when accountEmail is null', async () => {
            const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
            const onSendEmail = vi.fn().mockResolvedValue(undefined);

            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Pat Player',
                    accountEmail: null,
                    extraEmails: [{ email: 'pat@example.com', verified: true }],
                }),
            ];

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

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Pat Player' }));
            fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

            await waitFor(() => {
                expect(onAddPlayerInvite).toHaveBeenCalledWith(1, 'pat@example.com');
            });
        });
    });

    describe('player row links', () => {
        it('name and id cells link to the player page', () => {
            const players = [
                createMockPlayerData({ id: 42, name: 'Sam Support', extraEmails: [] }),
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

            const links = screen.getAllByRole('link', { name: /Sam Support|42/ });
            for (const link of links) {
                expect(link).toHaveAttribute('href', '/footy/player/42');
            }
        });

        it('falls back to an empty path segment when player id is zero', () => {
            const players = [
                createMockPlayerData({ id: 0, name: 'Zero Player', extraEmails: [] }),
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

            const links = screen.getAllByRole('link', { name: /Zero Player|0/ });
            for (const link of links) {
                expect(link).toHaveAttribute('href', '/footy/player/');
            }
        });
    });

    describe('onboard error handling', () => {
        it('shows error notification when onAddPlayerInvite throws', async () => {
            const errorMsg = 'Failed to create invite';
            const onAddPlayerInvite = vi.fn().mockRejectedValue(new Error(errorMsg));
            const onSendEmail = vi.fn();

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

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
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    color: 'red',
                    title: 'Error',
                    message: 'Failed to onboard players.',
                }));
            });

            expect(captureUnexpectedError).toHaveBeenCalled();
        });

        it('shows error notification when onSendEmail throws', async () => {
            const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
            const onSendEmail = vi.fn().mockRejectedValue(new Error('Failed to send email'));

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

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
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    color: 'red',
                    title: 'Error',
                    message: 'Failed to onboard players.',
                }));
            });

            expect(captureUnexpectedError).toHaveBeenCalled();
        });

        it('does not trigger onboarding when no players are selected', () => {
            const onAddPlayerInvite = vi.fn();
            const onSendEmail = vi.fn();

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
            ];

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

            expect(screen.getByRole('button', { name: 'Onboard player' })).toBeDisabled();
            expect(onAddPlayerInvite).not.toHaveBeenCalled();
            expect(onSendEmail).not.toHaveBeenCalled();
        });

        it('reports count of skipped players (no email)', async () => {
            const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
            const onSendEmail = vi.fn().mockResolvedValue(undefined);

            const players = [
                createMockPlayerData({ id: 1, name: 'No Email', accountEmail: null, extraEmails: [] }),
                createMockPlayerData({ id: 2, name: 'Has Email', accountEmail: 'has@example.com' }),
            ];

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

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));
            fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

            await waitFor(() => {
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    title: 'Onboarding sent',
                    message: 'Invites: 1 sent. 1 skipped.',
                }));
            });
        });

        it('reports successful onboarding count', async () => {
            const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
            const onSendEmail = vi.fn().mockResolvedValue(undefined);

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
                createMockPlayerData({ id: 2, name: 'Pat Player', accountEmail: 'pat@example.com' }),
            ];

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

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));
            fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

            await waitFor(() => {
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    title: 'Onboarding sent',
                    message: 'Invites: 2 sent.',
                }));
            });
        });

        it('uses verified extra email when accountEmail is null', async () => {
            const onAddPlayerInvite = vi.fn().mockResolvedValue('https://example.com/invite');
            const onSendEmail = vi.fn().mockResolvedValue(undefined);

            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Pat Player',
                    accountEmail: null,
                    extraEmails: [{ email: 'verified@example.com', verified: true }],
                }),
            ];

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

            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Pat Player' }));
            fireEvent.click(screen.getByRole('button', { name: 'Onboard player' }));

            await waitFor(() => {
                expect(onAddPlayerInvite).toHaveBeenCalledWith(1, 'verified@example.com');
            });
        });
    });

    describe('impersonate functionality', () => {
        it('successfully impersonates a player', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        userIdByEmail={{ 'alex@example.com': 'user-123' }}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Impersonate' }));

            await waitFor(() => {
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    color: 'teal',
                    title: 'Impersonation active',
                    message: 'Now impersonating Alex Admin.',
                }));
            });

            expect(mockRefresh).toHaveBeenCalledTimes(1);

            vi.clearAllMocks();
        });

        it('falls back to accountEmail in the impersonation success message when name is missing', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });

            const players = [
                createMockPlayerData({ id: 1, name: null as never, accountEmail: 'fallback@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        userIdByEmail={{ 'fallback@example.com': 'user-123' }}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Impersonate' }));

            await waitFor(() => {
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    title: 'Impersonation active',
                    message: 'Now impersonating fallback@example.com.',
                }));
            });

            vi.clearAllMocks();
        });

        it('does not call impersonation when player has no account', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'No Account', accountEmail: null }),
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
            expect(notifications.show).not.toHaveBeenCalledWith(expect.objectContaining({
                title: 'No user account found',
            }));
        });

        it('handles impersonate API error', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
                json: () => Promise.resolve({}),
            });

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        userIdByEmail={{ 'alex@example.com': 'user-123' }}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Impersonate' }));

            await waitFor(() => {
                expect(notifications.update).toHaveBeenCalledWith(expect.objectContaining({
                    id: 'notification-id',
                    color: 'red',
                    title: 'Error',
                    message: 'Failed to impersonate user.',
                }));
            });

            vi.clearAllMocks();
        });

        it('passes correct userId to impersonate API', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            });

            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin', accountEmail: 'alex@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={[]}
                        userIdByEmail={{ 'alex@example.com': 'custom-user-id' }}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            fireEvent.click(screen.getByRole('button', { name: 'Impersonate' }));

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/auth/admin/impersonate-user',
                    expect.objectContaining({
                        method: 'POST',
                        body: JSON.stringify({ userId: 'custom-user-id' }),
                    }),
                );
            });

            vi.clearAllMocks();
        });
    });

    describe('filter edge cases', () => {
        it('filters with whitespace-only input (treats as empty)', () => {
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

            fireEvent.change(screen.getByPlaceholderText(/filter/i), { target: { value: '   ' } });

            // Both players should still be visible (whitespace is trimmed to empty)
            expect(screen.getByText('Alex Admin')).toBeInTheDocument();
            expect(screen.getByText('Pat Player')).toBeInTheDocument();
        });

        it('filters case-insensitively', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
                createMockPlayerData({ id: 2, name: 'pat player' }),
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

            fireEvent.change(screen.getByPlaceholderText(/filter/i), { target: { value: 'PAT' } });

            expect(screen.getByText('pat player')).toBeInTheDocument();
            expect(screen.queryByText('Alex Admin')).not.toBeInTheDocument();
        });

        it('filters by partial name match', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alexander Admin' }),
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

            fireEvent.change(screen.getByPlaceholderText(/filter/i), { target: { value: 'ander' } });

            expect(screen.getByText('Alexander Admin')).toBeInTheDocument();
            expect(screen.queryByText('Pat Player')).not.toBeInTheDocument();
        });

        it('shows all players when filter is cleared', () => {
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

            const filterInput = screen.getByPlaceholderText(/filter/i);
            fireEvent.change(filterInput, { target: { value: 'Pat' } });
            fireEvent.change(filterInput, { target: { value: '' } });

            expect(screen.getByText('Alex Admin')).toBeInTheDocument();
            expect(screen.getByText('Pat Player')).toBeInTheDocument();
        });
    });

    describe('players with null/missing fields', () => {
        it('renders player with null name', () => {
            const players = [
                createMockPlayerData({ id: 1, name: null as unknown as string }),
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

            const rows = screen.getAllByRole('row').slice(1);
            expect(rows).toHaveLength(1);
        });

        it('renders player with null accountEmail and no extra emails', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'No Email Player', accountEmail: null, extraEmails: [] }),
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
            expect(within(table).getByText('No Email Player')).toBeInTheDocument();
            // Auth column should show "No"
            expect(within(table).getByText('No')).toBeInTheDocument();
        });

        it('renders player with null joined and finished dates', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'No Dates', joined: null, finished: null }),
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

            expect(screen.getByText('No Dates')).toBeInTheDocument();
        });
    });

    describe('sort by ID', () => {
        it('sorts by id descending on initial click', () => {
            const players = [
                createMockPlayerData({ id: 3, name: 'Charlie' }),
                createMockPlayerData({ id: 1, name: 'Alice' }),
                createMockPlayerData({ id: 2, name: 'Bob' }),
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by ID' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Charlie')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
            expect(within(rows[2]).getByText('Alice')).toBeInTheDocument();
        });

        it('sorts by id ascending on second click', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alice' }),
                createMockPlayerData({ id: 2, name: 'Bob' }),
                createMockPlayerData({ id: 3, name: 'Charlie' }),
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by ID' }));
            fireEvent.click(screen.getByRole('button', { name: 'Sort by ID' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
            expect(within(rows[2]).getByText('Charlie')).toBeInTheDocument();
        });
    });

    describe('sort by Emails Verified', () => {
        it('sorts by emails verified with one player having unverified extras', () => {
            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Unverified',
                    extraEmails: [{ email: 'unverified@example.com', verified: false }],
                }),
                createMockPlayerData({
                    id: 2,
                    name: 'No Extra',
                    extraEmails: [],
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Emails Verified' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Unverified')).toBeInTheDocument();
            expect(within(rows[1]).getByText('No Extra')).toBeInTheDocument();
        });

        it('sorts by emails verified descending', () => {
            const players = [
                createMockPlayerData({
                    id: 1,
                    name: 'Unverified',
                    extraEmails: [{ email: 'unverified@example.com', verified: false }],
                }),
                createMockPlayerData({
                    id: 2,
                    name: 'Verified',
                    extraEmails: [{ email: 'verified@example.com', verified: true }],
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

            fireEvent.click(screen.getByRole('button', { name: 'Sort by Emails Verified' }));
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Emails Verified' }));

            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Verified')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Unverified')).toBeInTheDocument();
        });
    });

    describe('select all checkbox indeterminate state', () => {
        it('shows indeterminate state when some players are selected', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex Admin' }),
                createMockPlayerData({ id: 2, name: 'Pat Player' }),
                createMockPlayerData({ id: 3, name: 'Sam Support' }),
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

            // Select only the first player
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Alex Admin' }));

            // Select-all checkbox should have indeterminate state
            const selectAllCheckbox = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Select all players' });
            expect(selectAllCheckbox.indeterminate).toBe(true);
        });

        it('clears indeterminate state when select-all is clicked', () => {
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

            // Select first player
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Alex Admin' }));

            // Click select-all to check all
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));

            // Both should be checked
            expect(screen.getByRole('checkbox', { name: 'Select Alex Admin' })).toBeChecked();
            expect(screen.getByRole('checkbox', { name: 'Select Pat Player' })).toBeChecked();
        });

        it('clears indeterminate state when select-all checkbox is unchecked', () => {
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

            // Select first player (indeterminate state)
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select Alex Admin' }));

            // First click selects all from indeterminate, second click clears all.
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));
            fireEvent.click(screen.getByRole('checkbox', { name: 'Select all players' }));

            // Both should be unchecked
            expect(screen.getByRole('checkbox', { name: 'Select Alex Admin' })).not.toBeChecked();
            expect(screen.getByRole('checkbox', { name: 'Select Pat Player' })).not.toBeChecked();
        });
    });

    describe('multiple selection cycles', () => {
        it('selects and deselects players multiple times', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alice' }),
                createMockPlayerData({ id: 2, name: 'Bob' }),
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

            const aliceCheckbox = screen.getByRole('checkbox', { name: 'Select Alice' });
            const bobCheckbox = screen.getByRole('checkbox', { name: 'Select Bob' });

            // First cycle: select both
            fireEvent.click(aliceCheckbox);
            fireEvent.click(bobCheckbox);
            expect(aliceCheckbox).toBeChecked();
            expect(bobCheckbox).toBeChecked();

            // Deselect Alice
            fireEvent.click(aliceCheckbox);
            expect(aliceCheckbox).not.toBeChecked();
            expect(bobCheckbox).toBeChecked();

            // Re-select Alice
            fireEvent.click(aliceCheckbox);
            expect(aliceCheckbox).toBeChecked();
            expect(bobCheckbox).toBeChecked();
        });
    });

    describe('sort icon indicators', () => {
        it('displays correct icon for current sorted column', () => {
            const players = [
                createMockPlayerData({ id: 2, name: 'Bob' }),
                createMockPlayerData({ id: 1, name: 'Alice' }),
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

            // Initially sorted by ID (ascending), check for up chevron
            fireEvent.click(screen.getByRole('button', { name: 'Sort by ID' }));

            // Switch to Name, should show up chevron (ascending)
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));

            // The Name header should have aria-sort="ascending"
            const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
            expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

            // ID header should be 'none'
            const idHeader = screen.getByRole('columnheader', { name: /ID/ });
            expect(idHeader).toHaveAttribute('aria-sort', 'none');
        });
    });

    describe('filter and sort together', () => {
        it('maintains sort order after filtering', () => {
            const players = [
                createMockPlayerData({ id: 3, name: 'Zara' }),
                createMockPlayerData({ id: 1, name: 'Alice' }),
                createMockPlayerData({ id: 2, name: 'Bob' }),
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

            // Sort by Name ascending
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));

            // Filter to show only players with 'A'
            fireEvent.change(screen.getByPlaceholderText(/filter/i), { target: { value: 'a' } });

            const rows = screen.getAllByRole('row').slice(1);
            // Should see Alice and Zara in name-sorted order
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Zara')).toBeInTheDocument();
        });

        it('clears filter while keeping sort state', () => {
            const players = [
                createMockPlayerData({ id: 2, name: 'Bob' }),
                createMockPlayerData({ id: 1, name: 'Alice' }),
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

            // Sort by Name
            fireEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));

            // Filter
            const filterInput = screen.getByPlaceholderText(/filter/i);
            fireEvent.change(filterInput, { target: { value: 'Bob' } });
            expect(screen.getByText('Bob')).toBeInTheDocument();

            // Clear filter
            fireEvent.change(filterInput, { target: { value: '' } });

            // Should see both in sorted order
            const rows = screen.getAllByRole('row').slice(1);
            expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
            expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
        });
    });

    describe('email normalization edge cases', () => {
        it('matches email with leading/trailing whitespace in userEmails', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex', accountEmail: 'alex@example.com' }),
            ];

            render(
                <Wrapper>
                    <AdminPlayerList
                        players={players}
                        userEmails={['  alex@example.com  ']}
                        onAddPlayerInvite={defaultAddPlayerProxy}
                        onSendEmail={stubSendEmail}
                    />
                </Wrapper>,
            );

            const table = screen.getByRole('table');
            expect(within(table).getAllByText('Yes')).toHaveLength(2);
        });

        it('handles empty string emails gracefully', () => {
            const players = [
                createMockPlayerData({ id: 1, name: 'Alex', accountEmail: '' }),
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
            expect(within(table).getByText('No')).toBeInTheDocument();
        });
    });

    describe('helper coverage', () => {
        it('covers nullable comparator null branches directly', () => {
            expect(compareNullableNumber(null, null, 'asc')).toBe(0);
            expect(compareNullableString(null, null, 'asc')).toBe(0);
            expect(compareNullableString(null, 'Alice', 'asc')).toBe(1);
            expect(compareNullableString('Alice', null, 'asc')).toBe(-1);
        });

        it('covers joined and finished comparisons when the left player has no date', () => {
            const undatedPlayer = createMockPlayerData({ id: 1, joined: null, finished: null });
            const datedPlayer = createMockPlayerData({
                id: 2,
                joined: new Date('2024-01-01'),
                finished: new Date('2024-02-01'),
            });

            expect(comparePlayers(undatedPlayer, datedPlayer, 'joined', 'asc', new Set())).toBe(1);
            expect(comparePlayers(undatedPlayer, datedPlayer, 'finished', 'asc', new Set())).toBe(1);
        });

        it('falls back to an empty preferred email for malformed extra-email data', () => {
            const player = createMockPlayerData({
                accountEmail: null,
                extraEmails: [{ email: undefined as unknown as string, verified: false }],
            });

            expect(getPreferredEmail(player)).toBe('');
        });

        it('falls back to a generic impersonation label when both name and accountEmail are missing', () => {
            const player = createMockPlayerData({
                name: null as never,
                accountEmail: null,
            });

            expect(getImpersonationLabel(player)).toBe('player');
        });

        it('returns zero for an unknown sort key fallback', () => {
            const firstPlayer = createMockPlayerData({ id: 1, name: 'Alice' });
            const secondPlayer = createMockPlayerData({ id: 2, name: 'Bob' });

            expect(comparePlayers(
                firstPlayer,
                secondPlayer,
                'unknown' as SortKey,
                'asc',
                new Set(),
            )).toBe(0);
        });
    });
});


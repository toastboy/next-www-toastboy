'use client';

import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Flex,
    Group,
    MantineProvider,
    Stack,
    Table,
    TableCaption,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    TextInput,
    UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import { addPlayerInvite } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import { sendEmailVerification } from '@/actions/verifyEmail';
import { config } from '@/lib/config';
import { PlayerDataType } from '@/types';

export interface Props {
    players: PlayerDataType[];
}

type SortKey = 'id' | 'name' | 'joined' | 'finished' | 'role' | 'auth' | 'extraEmails';
type SortDirection = 'asc' | 'desc';

/**
 * Formats a date-like value for display in the table.
 *
 * @param value - The date value to format; accepts Date, ISO string, null, or undefined.
 * @returns A localized date string (`sv` locale), or `-` when missing.
 */
const formatDate = (value: Date | string | null | undefined) => {
    if (value == null) return '-';
    return new Date(value).toLocaleDateString('sv');
};

/**
 * Compares nullable numeric values with consistent null ordering.
 *
 * @param a - The left-hand numeric value.
 * @param b - The right-hand numeric value.
 * @param direction - Sort direction (`asc` or `desc`).
 * @returns A comparison value suitable for Array.sort.
 */
const compareNullableNumber = (
    a: number | null | undefined,
    b: number | null | undefined,
    direction: SortDirection,
) => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return direction === 'asc' ? a - b : b - a;
};

/**
 * Compares nullable string values with locale-aware ordering.
 *
 * @param a - The left-hand string value.
 * @param b - The right-hand string value.
 * @param direction - Sort direction (`asc` or `desc`).
 * @returns A comparison value suitable for Array.sort.
 */
const compareNullableString = (
    a: string | null | undefined,
    b: string | null | undefined,
    direction: SortDirection,
) => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    const result = a.localeCompare(b);
    return direction === 'asc' ? result : -result;
};

/**
 * Applies the current sort key to two players.
 *
 * @param a - The left-hand player.
 * @param b - The right-hand player.
 * @param key - The player field to compare.
 * @param direction - Sort direction (`asc` or `desc`).
 * @returns A comparison value suitable for Array.sort.
 */
const comparePlayers = (
    a: PlayerDataType,
    b: PlayerDataType,
    key: SortKey,
    direction: SortDirection,
) => {
    switch (key) {
        case 'id':
            return compareNullableNumber(a.id, b.id, direction);
        case 'name':
            return compareNullableString(a.name, b.name, direction);
        case 'joined':
            return compareNullableNumber(
                a.joined ? new Date(a.joined).getTime() : null,
                b.joined ? new Date(b.joined).getTime() : null,
                direction,
            );
        case 'finished':
            return compareNullableNumber(
                a.finished ? new Date(a.finished).getTime() : null,
                b.finished ? new Date(b.finished).getTime() : null,
                direction,
            );
        case 'role':
            return compareNullableNumber(a.isAdmin ? 1 : 0, b.isAdmin ? 1 : 0, direction);
        case 'auth':
            return compareNullableNumber(a.accountEmail ? 1 : 0, b.accountEmail ? 1 : 0, direction);
        case 'extraEmails':
            return compareNullableNumber(
                a.extraEmails.every((email) => email.verifiedAt) ? 1 : 0,
                b.extraEmails.every((email) => email.verifiedAt) ? 1 : 0,
                direction,
            );
        default:
            return 0;
    }
};

/**
 * Chooses the best email for a player, preferring accountEmail then verified extras.
 *
 * @param player - The player to derive the preferred email from.
 * @returns The preferred email or an empty string if none is available.
 */
const getPreferredEmail = (player: PlayerDataType) => {
    if (player.accountEmail) {
        return player.accountEmail;
    }
    if (!player.extraEmails.length) return '';
    const verifiedEmail = player.extraEmails.find((playerEmail) => playerEmail.verifiedAt);
    return (verifiedEmail ?? player.extraEmails[0])?.email ?? '';
};

/**
 * Builds the HTML for the onboarding invite email.
 *
 * @param inviteLink - The invite link for claim signup.
 * @returns Sanitizable HTML content for the invitation email body.
 */
const buildInviteEmail = (inviteLink: string) => ReactDOMServer.renderToStaticMarkup(
    <MantineProvider>
        <Flex direction="column" gap="md">
            <Text>
                Welcome to Toastboy FC!
            </Text>
            <Text>
                Follow this link to get started:
                <Anchor href={inviteLink}>confirm your account</Anchor>
            </Text>
            <Text>
                We look forward to seeing you on the pitch! The games are every Tuesday at 18:00 at Kelsey Kerridge in Cambridge. Please arrive a bit early so you&apos;ve got time to park and pay the day membership.

                All the details are here:
            </Text>
            <Anchor href="https://www.toastboy.co.uk/footy/info">
                Toastboy FC info page
            </Anchor>
            <Text>
                Cheers,
                Jon
            </Text>
        </Flex>
    </MantineProvider>,
);

/**
 * Admin table for managing players, invitations, and email verification.
 *
 * @param props - Component props.
 * @param props.players - Players to render in the table.
 * @returns The rendered admin player list table.
 */
export const AdminPlayerList: React.FC<Props> = ({ players }) => {
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filter, setFilter] = useState('');

    /**
     * Filters players by name based on the current text input.
     *
     * @returns The filtered player list.
     */
    const filteredPlayers = useMemo(() => {
        if (!players) return [];
        const trimmedFilter = filter.trim().toLowerCase();
        if (!trimmedFilter) return players;
        return players.filter((player) => (
            player.name?.toLowerCase().includes(trimmedFilter)
        ));
    }, [players, filter]);

    /**
     * Applies sorting to the filtered players.
     *
     * @returns The sorted player list.
     */
    const sortedPlayers = useMemo(() => {
        const data = [...filteredPlayers];
        data.sort((a, b) => comparePlayers(a, b, sortKey, sortDirection));
        return data;
    }, [filteredPlayers, sortKey, sortDirection]);

    if (!players) {
        return (
            <Text>Loading players...</Text>
        );
    }

    if (players.length === 0) {
        return (
            <Text>No players found.</Text>
        );
    }

    /**
     * Selects or clears all visible players.
     *
     * @param checked - Whether the select-all checkbox is checked.
     */
    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? filteredPlayers.map((player) => player.id) : []);
    };

    /**
     * Toggles a single player row selection.
     *
     * @param playerId - The player ID to toggle.
     * @param checked - Whether the checkbox is checked.
     */
    const toggleSelectPlayer = (playerId: number, checked: boolean) => {
        setSelectedIds((prev) => (
            checked
                ? [...prev, playerId]
                : prev.filter((id) => id !== playerId)
        ));
    };

    const allSelected = filteredPlayers.length > 0 && selectedIds.length === filteredPlayers.length;
    const someSelected = selectedIds.length > 0 && !allSelected;
    const hasSelection = selectedIds.length > 0;
    const selectedPlayers = players.filter((player) => selectedIds.includes(player.id));

    /**
     * Returns the sort icon for the provided column key.
     *
     * @param key - Column sort key.
     * @returns The appropriate sort icon element.
     */
    const getSortIcon = (key: SortKey) => {
        if (key !== sortKey) return <IconSelector size={14} />;
        return sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
    };

    /**
     * Renders a sortable header label with the current sort icon.
     *
     * @param label - Column display label.
     * @param key - Column sort key.
     * @returns A sortable header element.
     */
    const renderSortHeader = (label: string, key: SortKey) => (
        <UnstyledButton
            type="button"
            onClick={() => handleSort(key)}
            aria-label={`Sort by ${label}`}
        >
            <Group gap={6} wrap="nowrap">
                <Text span>{label}</Text>
                {getSortIcon(key)}
            </Group>
        </UnstyledButton>
    );

    /**
     * Updates the sort state for the selected column.
     *
     * @param key - Column sort key.
     */
    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortKey(key);
        setSortDirection('asc');
    };

    /**
     * Sends Better Auth onboarding invitations for the selected players.
     *
     * @param invitePlayers - The players to invite.
     * @returns A promise that resolves when invitations are handled.
     */
    const handleSendInvitations = async (invitePlayers: PlayerDataType[]) => {
        if (invitePlayers.length === 0) {
            notifications.show({
                color: 'yellow',
                title: 'No players selected',
                message: 'Select at least one player to send invitations.',
            });
            return;
        }

        const id = notifications.show({
            loading: true,
            title: 'Sending invitations',
            message: 'Sending invitations...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            let sent = 0;
            let skipped = 0;

            for (const player of invitePlayers) {
                const email = getPreferredEmail(player);
                if (!email) {
                    skipped += 1;
                    continue;
                }

                const inviteLink = await addPlayerInvite(player.id, email);
                const html = buildInviteEmail(inviteLink);
                await sendEmail(email, 'footy@toastboy.co.uk', 'Welcome to Toastboy FC!', html);
                sent += 1;
            }

            notifications.update({
                id,
                color: 'teal',
                title: 'Invitations sent',
                message: `Sent ${sent} invitation(s).${skipped ? ` Skipped ${skipped} without email.` : ''}`,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            console.error('Failed to send invitations:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    /**
     * Sends verification emails for any unverified extra addresses.
     *
     * @param verifyPlayers - The players whose emails should be verified.
     * @returns A promise that resolves when verification emails are handled.
     */
    const handleSendVerifications = async (verifyPlayers: PlayerDataType[]) => {
        if (verifyPlayers.length === 0) {
            notifications.show({
                color: 'yellow',
                title: 'No players selected',
                message: 'Select at least one player to send verification emails.',
            });
            return;
        }

        const id = notifications.show({
            loading: true,
            title: 'Sending verifications',
            message: 'Sending verification emails...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            let sent = 0;
            let skipped = 0;

            for (const player of verifyPlayers) {
                const unverified = player.extraEmails.filter((email) => !email.verifiedAt);
                if (unverified.length === 0) {
                    skipped += 1;
                    continue;
                }

                for (const email of unverified) {
                    await sendEmailVerification(email.email, player);
                    sent += 1;
                }
            }

            notifications.update({
                id,
                color: 'teal',
                title: 'Verification emails sent',
                message: `Sent ${sent} verification email(s).${skipped ? ` Skipped ${skipped} with no unverified emails.` : ''}`,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            console.error('Failed to send verification emails:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const rows = sortedPlayers.map((player: PlayerDataType) => {
        const playerHref = `/footy/player/${encodeURIComponent(player.id || '')}`;
        const hasAuthAccount = Boolean(player.accountEmail);
        const extraEmailsVerified = player.extraEmails.every((email) => email.verifiedAt);

        return (
            <TableTr key={player.id}>
                <TableTd w="2.5rem">
                    <Checkbox
                        checked={selectedIds.includes(player.id)}
                        onChange={(event) => toggleSelectPlayer(player.id, event.currentTarget.checked)}
                        aria-label={`Select ${player.name ?? ''}`}
                    />
                </TableTd>
                <TableTd w="4rem">
                    <Anchor href={playerHref}>{player.id}</Anchor>
                </TableTd>
                <TableTd>
                    <Anchor href={playerHref}>{player.name}</Anchor>
                </TableTd>
                <TableTd>{formatDate(player.joined)}</TableTd>
                <TableTd>{formatDate(player.finished)}</TableTd>
                <TableTd>{player.isAdmin ? 'Admin' : 'Player'}</TableTd>
                <TableTd>{hasAuthAccount ? 'Yes' : 'No'}</TableTd>
                <TableTd>{extraEmailsVerified ? 'Yes' : 'No'}</TableTd>
            </TableTr>
        );
    });

    return (
        <Container fluid>
            <Stack gap="sm">
                <Text fw={700} data-testid="admin-player-list-count">
                    Players ({players.length})
                </Text>
                <Group justify="space-between" align="center" wrap="wrap">
                    <TextInput
                        placeholder="Filter by name"
                        value={filter}
                        onChange={(event) => setFilter(event.currentTarget.value)}
                    />
                    <Group gap="xs">
                        <Button
                            size="xs"
                            type="button"
                            disabled={!hasSelection}
                            onClick={() => handleSendInvitations(selectedPlayers)}
                        >
                            Send invitations
                        </Button>
                        <Button
                            size="xs"
                            type="button"
                            disabled={!hasSelection}
                            onClick={() => handleSendVerifications(selectedPlayers)}
                        >
                            Send verification emails
                        </Button>
                    </Group>
                </Group>
                <Table
                    striped
                    highlightOnHover
                    withTableBorder
                    withColumnBorders
                    w="100%"
                    style={{ tableLayout: 'fixed' }}
                >
                    <TableCaption>Registered players</TableCaption>
                    <TableThead>
                        <TableTr>
                            <TableTh w="2.5rem">
                                <Checkbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={(event) => toggleSelectAll(event.currentTarget.checked)}
                                    aria-label="Select all players"
                                />
                            </TableTh>
                            <TableTh
                                w="4rem"
                                aria-sort={sortKey === 'id' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                            >
                                {renderSortHeader('ID', 'id')}
                            </TableTh>
                            <TableTh aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                {renderSortHeader('Name', 'name')}
                            </TableTh>
                            <TableTh aria-sort={sortKey === 'joined' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                {renderSortHeader('Joined', 'joined')}
                            </TableTh>
                            <TableTh aria-sort={sortKey === 'finished' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                {renderSortHeader('Finished', 'finished')}
                            </TableTh>
                            <TableTh aria-sort={sortKey === 'role' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                {renderSortHeader('Role', 'role')}
                            </TableTh>
                            <TableTh aria-sort={sortKey === 'auth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                {renderSortHeader('Auth', 'auth')}
                            </TableTh>
                            <TableTh aria-sort={sortKey === 'extraEmails' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                {renderSortHeader('Emails Verified', 'extraEmails')}
                            </TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>{rows}</TableTbody>
                </Table>
            </Stack>
        </Container>
    );
};

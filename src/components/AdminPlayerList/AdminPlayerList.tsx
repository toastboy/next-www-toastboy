'use client';

import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    SegmentedControl,
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
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
    buildInviteEmail,
    comparePlayers,
    getImpersonationLabel,
    getPreferredEmail,
    isOnboarded,
    type SortDirection,
    type SortKey,
} from '@/lib/adminPlayer';
import { config } from '@/lib/config';
import { formatDate } from '@/lib/dates';
import { normalizeEmail } from '@/lib/email/normalizeEmail';
import { assertOkResponse, toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { PlayerDataType } from '@/types';
import { AddPlayerInviteProxy } from '@/types/actions/CreatePlayer';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

type FinishedFilter = 'all' | 'finished' | 'active';
type AuthFilter = 'all' | 'invited' | 'claimed';
type EmailsVerifiedFilter = 'all' | 'verified' | 'unverified';

const finishedFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Finished', value: 'finished' },
    { label: 'Active', value: 'active' },
];

const authFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Invited', value: 'invited' },
    { label: 'Claimed', value: 'claimed' },
];

const emailsVerifiedFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Verified', value: 'verified' },
    { label: 'Unverified', value: 'unverified' },
];

export interface Props {
    players: PlayerDataType[];
    userEmails?: string[];
    userIdByEmail?: Record<string, string>;
    onAddPlayerInvite: AddPlayerInviteProxy;
    onSendEmail: SendEmailProxy;
}

/**
 * Admin table for managing players, invitations, and email verification.
 *
 * @param props - Component props.
 * @param props.players - Players to render in the table.
 * @param props.userEmails - Better Auth user emails to determine onboarding status.
 * @returns The rendered admin player list table.
 */
export const AdminPlayerList = ({
    players,
    userEmails,
    userIdByEmail,
    onAddPlayerInvite,
    onSendEmail,
}: Props) => {
    const router = useRouter();
    const userEmailSet = useMemo(
        () => new Set((userEmails ?? [])
            .map((email) => normalizeEmail(email)).filter((email) => email.length > 0)),
        [userEmails],
    );
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filter, setFilter] = useState('');
    const [filterFinished, setFilterFinished] = useState<FinishedFilter>('all');
    const [filterAuth, setFilterAuth] = useState<AuthFilter>('all');
    const [filterEmailsVerified, setFilterEmailsVerified] = useState<EmailsVerifiedFilter>('all');

    /**
     * Filters players by name and the active tri-state filters.
     *
     * @returns The filtered player list.
     */
    const filteredPlayers = useMemo(() => {
        if (!players) return [];
        const trimmedFilter = filter.trim().toLowerCase();
        return players.filter((player) => {
            if (trimmedFilter && !player.name?.toLowerCase().includes(trimmedFilter)) return false;
            if (filterFinished === 'finished' && !player.finished) return false;
            if (filterFinished === 'active' && player.finished) return false;
            const claimed = isOnboarded(player, userEmailSet);
            if (filterAuth === 'claimed' && !claimed) return false;
            if (filterAuth === 'invited' && claimed) return false;
            if (filterEmailsVerified !== 'all') {
                const hasExtraEmails = player.extraEmails.length > 0;
                const extraEmailsVerified = hasExtraEmails && player.extraEmails.every((email) => email.verified);
                if (filterEmailsVerified === 'verified' && !extraEmailsVerified) return false;
                if (filterEmailsVerified === 'unverified' && (!hasExtraEmails || extraEmailsVerified)) return false;
            }
            return true;
        });
    }, [players, filter, filterFinished, filterAuth, filterEmailsVerified, userEmailSet]);

    /**
     * Applies sorting to the filtered players.
     *
     * @returns The sorted player list.
     */
    const sortedPlayers = useMemo(() => {
        const data = [...filteredPlayers];
        data.sort((a, b) => comparePlayers(a, b, sortKey, sortDirection, userEmailSet));
        return data;
    }, [filteredPlayers, sortKey, sortDirection, userEmailSet]);

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
            checked ?
                [...prev, playerId] :
                prev.filter((id) => id !== playerId)
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
     * Sends onboarding invites and extra email verifications for the selected
     * players. Not expected to called with an empty list since the button is
     * disabled, but will handle that case anyway.
     *
     * @param onboardPlayers - The players to onboard.
     * @returns A promise that resolves when onboarding emails are handled.
     */
    const handleOnboardPlayers = async (onboardPlayers: PlayerDataType[]) => {
        const id = notifications.show({
            loading: true,
            title: 'Onboarding players',
            message: 'Sending onboarding emails...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            let inviteSent = 0;
            let inviteSkipped = 0;
            for (const player of onboardPlayers) {
                const email = getPreferredEmail(player);
                if (!email) {
                    inviteSkipped += 1;
                } else {
                    const inviteLink = await onAddPlayerInvite(player.id, email);
                    const html = buildInviteEmail(inviteLink);
                    const cc = 'footy@toastboy.co.uk';
                    await onSendEmail({
                        to: email,
                        cc,
                        subject: 'Welcome to Toastboy FC!',
                        html,
                    });
                    inviteSent += 1;
                }
            }

            notifications.update({
                id,
                color: 'teal',
                title: 'Onboarding sent',
                message: [
                    `Invites: ${inviteSent} sent`,
                    inviteSkipped ? `${inviteSkipped} skipped` : null,
                ].filter(Boolean).join('. ') + '.',
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'AdminPlayerList',
                action: 'sendOnboarding',
                route: '/footy/admin/players',
                extra: {
                    selectedCount: selectedIds.length,
                },
            });
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: toPublicMessage(err, 'Failed to onboard players.'),
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const getUserIdForPlayer = (player: PlayerDataType) => {
        const email = normalizeEmail(player.accountEmail);
        if (!email) return null;
        return userIdByEmail?.[email] ?? null;
    };

    const handleImpersonatePlayer = async (player: PlayerDataType) => {
        const userId = getUserIdForPlayer(player);

        // The button should be disabled if there's no userId.

        const id = notifications.show({
            loading: true,
            title: 'Starting impersonation',
            message: 'Switching session...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const response = await fetch('/api/auth/admin/impersonate-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            await assertOkResponse(response, {
                method: 'POST',
                fallbackMessage: 'Failed to impersonate user.',
            });

            router.refresh();
            notifications.update({
                id,
                color: 'teal',
                title: 'Impersonation active',
                message: `Now impersonating ${getImpersonationLabel(player)}.`,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            const message = toPublicMessage(err, 'Failed to impersonate user.');
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const rows = sortedPlayers.map((player: PlayerDataType) => {
        const playerHref = `/footy/player/${encodeURIComponent(player.id || '')}`;
        const hasAuthAccount = isOnboarded(player, userEmailSet);
        const hasExtraEmails = player.extraEmails.length > 0;
        const extraEmailsVerified = hasExtraEmails && player.extraEmails.every((email) => email.verified);
        const userId = getUserIdForPlayer(player);

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
                <TableTd>{hasAuthAccount ? 'Yes' : 'No'}</TableTd>
                <TableTd>{hasExtraEmails ? (extraEmailsVerified ? 'Yes' : 'No') : ''}</TableTd>
                <TableTd>
                    <Button
                        size="xs"
                        variant="light"
                        disabled={!userId}
                        onClick={() => handleImpersonatePlayer(player)}
                    >
                        Impersonate
                    </Button>
                </TableTd>
            </TableTr>
        );
    });

    return (
        <Container fluid>
            <Paper w="100%" p="xl">
                <Stack gap="sm">
                    <Text fw={700}>
                        {sortedPlayers.length} of {players.length} visible, {selectedIds.length} selected
                    </Text>
                    <Group justify="space-between" align="center" wrap="wrap" mb="md">
                        <Group gap="md" wrap="wrap" align="flex-end">
                            <TextInput
                                label="Name"
                                size="xs"
                                placeholder="Filter by name"
                                value={filter}
                                onChange={(event) => setFilter(event.currentTarget.value)}
                            />
                            <Stack gap={2}>
                                <Text id="finished-filter-label" size="xs" fw={500}>Finished</Text>
                                <SegmentedControl
                                    aria-labelledby="finished-filter-label"
                                    size="xs"
                                    data={finishedFilterOptions}
                                    value={filterFinished}
                                    onChange={(value) => setFilterFinished(value as FinishedFilter)}
                                />
                            </Stack>
                            <Stack gap={2}>
                                <Text id="auth-filter-label" size="xs" fw={500}>Auth</Text>
                                <SegmentedControl
                                    aria-labelledby="auth-filter-label"
                                    size="xs"
                                    data={authFilterOptions}
                                    value={filterAuth}
                                    onChange={(value) => setFilterAuth(value as AuthFilter)}
                                />
                            </Stack>
                            <Stack gap={2}>
                                <Text id="emails-verified-filter-label" size="xs" fw={500}>Emails Verified</Text>
                                <SegmentedControl
                                    aria-labelledby="emails-verified-filter-label"
                                    size="xs"
                                    data={emailsVerifiedFilterOptions}
                                    value={filterEmailsVerified}
                                    onChange={(value) => setFilterEmailsVerified(value as EmailsVerifiedFilter)}
                                />
                            </Stack>
                        </Group>
                        <Group gap="xs">
                            <Button
                                size="xs"
                                type="button"
                                disabled={!hasSelection}
                                onClick={() => handleOnboardPlayers(selectedPlayers)}
                            >
                                Onboard {selectedPlayers.length} player(s)
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
                                <TableTh aria-sort={sortKey === 'auth' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Auth', 'auth')}
                                </TableTh>
                                <TableTh aria-sort={sortKey === 'extraEmails' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Emails Verified', 'extraEmails')}
                                </TableTh>
                                <TableTh w="7rem">Impersonate</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>{rows}</TableTbody>
                    </Table>
                </Stack>
            </Paper>
        </Container>
    );
};

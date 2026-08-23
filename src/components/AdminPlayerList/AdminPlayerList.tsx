'use client';

import {
    Anchor,
    Button,
    Center,
    Checkbox,
    Container,
    Group,
    Paper,
    SegmentedControl,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import type { SortDirection, SortKey } from '@/lib/adminPlayer';
import {
    buildInviteEmail,
    comparePlayers,
    getImpersonationLabel,
    getPreferredEmail,
    isOnboarded,
} from '@/lib/adminPlayer';
import { config } from '@/lib/config';
import { formatDate } from '@/lib/dates';
import { normalizeEmail } from '@/lib/email/normalizeEmail';
import { assertOkResponse, toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { PlayerDataType } from '@/types';
import type { AddPlayerInviteProxy } from '@/types/actions/CreatePlayer';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

type FinishedFilter = 'all' | 'finished' | 'active';
type AuthFilter = 'all' | 'invited' | 'claimed';

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
        () =>
            new Set(
                (userEmails ?? [])
                    .map((email) => normalizeEmail(email))
                    .filter((email) => email.length > 0),
            ),
        [userEmails],
    );
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [filter, setFilter] = useState('');
    const [filterFinished, setFilterFinished] = useState<FinishedFilter>('all');
    const [filterAuth, setFilterAuth] = useState<AuthFilter>('all');

    /**
     * Filters players by name and the active tri-state filters.
     *
     * @returns The filtered player list.
     */
    const filteredPlayers = useMemo(() => {
        if (!players) return [];
        const trimmedFilter = filter.trim().toLowerCase();
        return players.filter((player) => {
            if (
                trimmedFilter &&
                !player.name?.toLowerCase().includes(trimmedFilter)
            )
                return false;
            if (filterFinished === 'finished' && !player.finished) return false;
            if (filterFinished === 'active' && player.finished) return false;
            const claimed = isOnboarded(player, userEmailSet);
            if (filterAuth === 'claimed' && !claimed) return false;
            if (filterAuth === 'invited' && claimed) return false;
            return true;
        });
    }, [players, filter, filterFinished, filterAuth, userEmailSet]);

    /**
     * Applies sorting to the filtered players.
     *
     * @returns The sorted player list.
     */
    const sortedPlayers = useMemo(() => {
        const data = [...filteredPlayers];
        data.sort((a, b) =>
            comparePlayers(a, b, sortKey, sortDirection, userEmailSet),
        );
        return data;
    }, [filteredPlayers, sortKey, sortDirection, userEmailSet]);

    if (!players) {
        return <Text>Loading players...</Text>;
    }

    if (players.length === 0) {
        return <Text>No players found.</Text>;
    }

    /**
     * Selects or clears all visible players.
     *
     * @param checked - Whether the select-all checkbox is checked.
     */
    const toggleSelectAll = (checked: boolean) => {
        setSelectedIds(
            checked ? filteredPlayers.map((player) => player.id) : [],
        );
    };

    /**
     * Toggles a single player row selection.
     *
     * @param playerId - The player ID to toggle.
     * @param checked - Whether the checkbox is checked.
     */
    const toggleSelectPlayer = (playerId: number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked
                ? [...prev, playerId]
                : prev.filter((id) => id !== playerId),
        );
    };

    const allSelected =
        filteredPlayers.length > 0 &&
        selectedIds.length === filteredPlayers.length;
    const someSelected = selectedIds.length > 0 && !allSelected;
    const hasSelection = selectedIds.length > 0;
    const selectedPlayers = players.filter((player) =>
        selectedIds.includes(player.id),
    );

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
            <Group
                gap={6}
                wrap="nowrap"
            >
                <Text span>{label}</Text>
                {sortKey === key ? (
                    sortDirection === 'asc' ? (
                        <IconSortAscending
                            size={16}
                            aria-hidden="true"
                            focusable={false}
                        />
                    ) : (
                        <IconSortDescending
                            size={16}
                            aria-hidden="true"
                            focusable={false}
                        />
                    )
                ) : null}
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
                    const inviteLink = await onAddPlayerInvite(
                        player.id,
                        email,
                    );
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
                message:
                    [
                        `Invites: ${inviteSent} sent`,
                        inviteSkipped ? `${inviteSkipped} skipped` : null,
                    ]
                        .filter(Boolean)
                        .join('. ') + '.',
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
        const userId = getUserIdForPlayer(player);

        return (
            <Table.Tr key={player.id}>
                <Table.Td w="2.5rem">
                    <Checkbox
                        checked={selectedIds.includes(player.id)}
                        onChange={(event) =>
                            toggleSelectPlayer(
                                player.id,
                                event.currentTarget.checked,
                            )
                        }
                        aria-label={`Select ${player.name ?? ''}`}
                    />
                </Table.Td>
                <Table.Td w="4rem">
                    <Anchor href={playerHref}>{player.id}</Anchor>
                </Table.Td>
                <Table.Td>
                    <Anchor href={playerHref}>{player.name}</Anchor>
                </Table.Td>
                <Table.Td>{formatDate(player.joined)}</Table.Td>
                <Table.Td>{formatDate(player.finished)}</Table.Td>
                <Table.Td>{hasAuthAccount ? 'Yes' : 'No'}</Table.Td>
                <Table.Td>
                    <Button
                        size="xs"
                        variant="light"
                        disabled={!userId}
                        onClick={() => handleImpersonatePlayer(player)}
                    >
                        Impersonate
                    </Button>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Container
            fluid
            mt="xl"
        >
            <Paper w="100%">
                <Stack gap="sm">
                    <Center>
                        <Title
                            order={2}
                            mb="md"
                        >
                            Admin: Players
                        </Title>
                    </Center>
                    <Text fw={700}>
                        {sortedPlayers.length} of {players.length} visible,{' '}
                        {selectedIds.length} selected
                    </Text>
                    <Group
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                        mb="md"
                    >
                        <Group
                            gap="md"
                            wrap="wrap"
                            align="flex-end"
                        >
                            <TextInput
                                label="Name"
                                size="xs"
                                placeholder="Filter by name"
                                value={filter}
                                onChange={(event) =>
                                    setFilter(event.currentTarget.value)
                                }
                            />
                            <Stack gap={2}>
                                <Text
                                    id="finished-filter-label"
                                    size="xs"
                                    fw={500}
                                >
                                    Finished
                                </Text>
                                <SegmentedControl
                                    aria-labelledby="finished-filter-label"
                                    size="xs"
                                    data={finishedFilterOptions}
                                    value={filterFinished}
                                    onChange={(value) =>
                                        setFilterFinished(
                                            value as FinishedFilter,
                                        )
                                    }
                                />
                            </Stack>
                            <Stack gap={2}>
                                <Text
                                    id="auth-filter-label"
                                    size="xs"
                                    fw={500}
                                >
                                    Auth
                                </Text>
                                <SegmentedControl
                                    aria-labelledby="auth-filter-label"
                                    size="xs"
                                    data={authFilterOptions}
                                    value={filterAuth}
                                    onChange={(value) =>
                                        setFilterAuth(value as AuthFilter)
                                    }
                                />
                            </Stack>
                        </Group>
                        <Group gap="xs">
                            <Button
                                size="xs"
                                type="button"
                                disabled={!hasSelection}
                                onClick={() =>
                                    handleOnboardPlayers(selectedPlayers)
                                }
                            >
                                Onboard {selectedPlayers.length} player(s)
                            </Button>
                        </Group>
                    </Group>
                    <Table.ScrollContainer
                        minWidth="100%"
                        scrollAreaProps={{ type: 'auto' }}
                    >
                        <Table
                            striped
                            highlightOnHover
                            withTableBorder
                            withColumnBorders
                            w="100%"
                            layout="fixed"
                        >
                            <Table.Caption>Registered players</Table.Caption>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w="2.5rem">
                                        <Checkbox
                                            checked={allSelected}
                                            indeterminate={someSelected}
                                            onChange={(event) =>
                                                toggleSelectAll(
                                                    event.currentTarget.checked,
                                                )
                                            }
                                            aria-label="Select all players"
                                        />
                                    </Table.Th>
                                    <Table.Th
                                        w="3rem"
                                        aria-sort={
                                            sortKey === 'id'
                                                ? sortDirection === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : 'none'
                                        }
                                    >
                                        {renderSortHeader('ID', 'id')}
                                    </Table.Th>
                                    <Table.Th
                                        w="10rem"
                                        aria-sort={
                                            sortKey === 'name'
                                                ? sortDirection === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : 'none'
                                        }
                                    >
                                        {renderSortHeader('Name', 'name')}
                                    </Table.Th>
                                    <Table.Th
                                        w="7rem"
                                        aria-sort={
                                            sortKey === 'joined'
                                                ? sortDirection === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : 'none'
                                        }
                                    >
                                        {renderSortHeader('Joined', 'joined')}
                                    </Table.Th>
                                    <Table.Th
                                        w="7rem"
                                        aria-sort={
                                            sortKey === 'finished'
                                                ? sortDirection === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : 'none'
                                        }
                                    >
                                        {renderSortHeader(
                                            'Finished',
                                            'finished',
                                        )}
                                    </Table.Th>
                                    <Table.Th
                                        w="4rem"
                                        aria-sort={
                                            sortKey === 'auth'
                                                ? sortDirection === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : 'none'
                                        }
                                    >
                                        {renderSortHeader('Auth', 'auth')}
                                    </Table.Th>
                                    <Table.Th w="7rem">Impersonate</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Stack>
            </Paper>
        </Container>
    );
};

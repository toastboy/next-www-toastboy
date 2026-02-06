'use client';

import {
    Button,
    Checkbox,
    Divider,
    Group,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';

import { config } from '@/lib/config';
import type { SubmitPickerProxy } from '@/types/actions/SubmitPicker';
import type { PickerPlayerType } from '@/types/PickerPlayerType';

export interface PickerFormProps {
    gameId: number;
    gameDate: string;
    players: PickerPlayerType[];
    submitPicker: SubmitPickerProxy;
}

type SortKey = 'name' | 'responseTime' | 'gamesPlayed';
type SortDirection = 'asc' | 'desc';

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

const formatResponseInterval = (seconds: number | null | undefined) => {
    if (seconds == null) return '-';
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) {
        return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`;
};

const getPlayerName = (row: PickerPlayerType) => row.player.name ?? `Player ${row.playerId}`;

const buildDefaultSelection = (rows: PickerPlayerType[], maxSelected = 12) => {
    if (!rows.length) return [];
    const sorted = [...rows].sort((a, b) => {
        const responseCompare = compareNullableNumber(a.responseInterval, b.responseInterval, 'asc');
        if (responseCompare !== 0) return responseCompare;
        const nameCompare = compareNullableString(a.player.name, b.player.name, 'asc');
        if (nameCompare !== 0) return nameCompare;
        return a.playerId - b.playerId;
    });
    return sorted.slice(0, maxSelected).map((row) => row.playerId);
};

export const PickerForm: React.FC<PickerFormProps> = ({
    gameId,
    gameDate,
    players,
    submitPicker,
}) => {
    const eligiblePlayers = useMemo(
        () => players.filter((player) => player.response === 'Yes'),
        [players],
    );
    const [sortKey, setSortKey] = useState<SortKey>('responseTime');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>(() => buildDefaultSelection(eligiblePlayers));
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const eligibleIdSet = new Set(eligiblePlayers.map((player) => player.playerId));
        setSelectedIds((prev) => prev.filter((id) => eligibleIdSet.has(id)));
    }, [eligiblePlayers]);

    const sortedPlayers = useMemo(() => {
        const data = [...eligiblePlayers];
        data.sort((a, b) => {
            switch (sortKey) {
                case 'name':
                    return compareNullableString(a.player.name, b.player.name, sortDirection);
                case 'responseTime':
                    return compareNullableNumber(a.responseInterval, b.responseInterval, sortDirection);
                case 'gamesPlayed':
                    return compareNullableNumber(a.gamesPlayed, b.gamesPlayed, sortDirection);
                default:
                    return 0;
            }
        });
        return data;
    }, [eligiblePlayers, sortKey, sortDirection]);

    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const filteredSelectedCount = useMemo(() => (
        eligiblePlayers.reduce((acc, row) => (selectedIdSet.has(row.playerId) ? acc + 1 : acc), 0)
    ), [eligiblePlayers, selectedIdSet]);

    const allSelected = eligiblePlayers.length > 0 && filteredSelectedCount === eligiblePlayers.length;
    const someSelected = filteredSelectedCount > 0 && !allSelected;
    const hasSelection = selectedIds.length > 0;

    const selectedPlayers = useMemo(() => (
        eligiblePlayers.filter((player) => selectedIdSet.has(player.playerId))
    ), [eligiblePlayers, selectedIdSet]);

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => Array.from(new Set([
                ...prev,
                ...eligiblePlayers.map((player) => player.playerId),
            ])));
            return;
        }

        const eligibleIdSet = new Set(eligiblePlayers.map((player) => player.playerId));
        setSelectedIds((prev) => prev.filter((id) => !eligibleIdSet.has(id)));
    };

    const toggleSelectPlayer = (playerId: number, checked: boolean) => {
        setSelectedIds((prev) => {
            if (checked) {
                return prev.includes(playerId) ? prev : [...prev, playerId];
            }
            return prev.filter((id) => id !== playerId);
        });
    };

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortKey(key);
        setSortDirection('asc');
    };

    const getSortIcon = (key: SortKey) => {
        if (key !== sortKey) return <IconSelector size={14} />;
        return sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
    };

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

    const handleSubmit = async () => {
        if (!hasSelection) {
            notifications.show({
                color: 'yellow',
                title: 'No players selected',
                message: 'Select at least one player before submitting.',
            });
            return;
        }

        const notificationId = 'picker-submit';
        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Submitting picker',
            message: 'Submitting selected players...',
            autoClose: false,
            withCloseButton: false,
        });

        setIsSubmitting(true);
        try {
            await submitPicker(
                selectedPlayers.map((player) => ({
                    playerId: player.playerId,
                    name: player.player.name ?? null,
                })),
            );
            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Selection submitted',
                message: `${selectedPlayers.length} players submitted.`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit selection';
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: errorMessage,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const rows = sortedPlayers.map((player) => {
        const playerName = getPlayerName(player);

        return (
            <TableTr key={player.playerId} data-testid="picker-row" data-player-id={player.playerId}>
                <TableTd w="2.5rem">
                    <Checkbox
                        checked={selectedIdSet.has(player.playerId)}
                        onChange={(event) => toggleSelectPlayer(player.playerId, event.currentTarget.checked)}
                        aria-label={`Select ${playerName}`}
                    />
                </TableTd>
                <TableTd>{playerName}</TableTd>
                <TableTd>{formatResponseInterval(player.responseInterval ?? null)}</TableTd>
                <TableTd>{player.gamesPlayed}</TableTd>
            </TableTr>
        );
    });

    return (
        <Stack gap="md">
            <Stack align="left" gap="xs">
                <Title order={2}>Picker</Title>
                <Text c="dimmed">Game {gameId}: {gameDate}</Text>
            </Stack>
            <Group justify="space-between" align="center" wrap="wrap">
                <Text fw={700}>Players selected ({selectedIds.length})</Text>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!hasSelection}
                    loading={isSubmitting}
                    w={150}
                >
                    Pick sides
                </Button>
            </Group>
            <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                w="100%"
                style={{ tableLayout: 'fixed' }}
            >
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
                        <TableTh aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            {renderSortHeader('Player', 'name')}
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'responseTime' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            {renderSortHeader('Response time', 'responseTime')}
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'gamesPlayed' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            {renderSortHeader('Total games played', 'gamesPlayed')}
                        </TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
            </Table>
            <Divider
                label="or"
                labelPosition="center"
            />
            <Group justify="space-between" align="center" wrap="wrap">
                <TextInput
                    data-testid="cancellation-reason"
                    placeholder="not enough players"
                    flex={1}
                />
                <Button
                    data-testid="cancel-game-button"
                    type="submit"
                    color="red"
                    w={150}
                >
                    Cancel game
                </Button>
            </Group>
        </Stack>
    );
};

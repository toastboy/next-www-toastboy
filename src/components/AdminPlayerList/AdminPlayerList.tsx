'use client';

import {
    Anchor,
    Checkbox,
    Container,
    Group,
    Table,
    TableCaption,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    UnstyledButton,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { PlayerDataType } from '@/types';

export interface Props {
    players: PlayerDataType[];
}

type SortKey = 'id' | 'name' | 'joined' | 'finished' | 'role' | 'auth' | 'extraEmails';
type SortDirection = 'asc' | 'desc';

const formatDate = (value: Date | string | null | undefined) => {
    if (value == null) return '-';
    return new Date(value).toLocaleDateString('sv');
};

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

export const AdminPlayerList: React.FC<Props> = ({ players }) => {
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const sortedPlayers = useMemo(() => {
        if (!players) return [];
        const data = [...players];
        data.sort((a, b) => comparePlayers(a, b, sortKey, sortDirection));
        return data;
    }, [players, sortKey, sortDirection]);

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

    const toggleSelectAll = (checked: boolean) => {
        if (!players) return;
        setSelectedIds(checked ? players.map((player) => player.id) : []);
    };

    const toggleSelectPlayer = (playerId: number, checked: boolean) => {
        setSelectedIds((prev) => (
            checked
                ? [...prev, playerId]
                : prev.filter((id) => id !== playerId)
        ));
    };

    const allSelected = players.length > 0 && selectedIds.length === players.length;
    const someSelected = selectedIds.length > 0 && !allSelected;

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

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortKey(key);
        setSortDirection('asc');
    };

    const rows = sortedPlayers.map((player: PlayerDataType) => {
        const playerHref = `/footy/player/${encodeURIComponent(player.id || '')}`;
        const hasAuthAccount = Boolean(player.accountEmail);
        const extraEmailsVerified = player.extraEmails.every((email) => email.verifiedAt);

        return (
            <TableTr key={player.id}>
                <TableTd>
                    <Checkbox
                        checked={selectedIds.includes(player.id)}
                        onChange={(event) => toggleSelectPlayer(player.id, event.currentTarget.checked)}
                        aria-label={`Select ${player.name ?? ''}`}
                    />
                </TableTd>
                <TableTd>
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
            <Text fw={700} mb="sm" data-testid="admin-player-list-count">
                Players ({players.length})
            </Text>
            <Table striped highlightOnHover withTableBorder withColumnBorders w="100%">
                <TableCaption>Registered players</TableCaption>
                <TableThead>
                    <TableTr>
                        <TableTh>
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={(event) => toggleSelectAll(event.currentTarget.checked)}
                                aria-label="Select all players"
                            />
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'id' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
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
        </Container>
    );
};

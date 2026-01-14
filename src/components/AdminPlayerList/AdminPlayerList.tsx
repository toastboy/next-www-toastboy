'use client';

import {
    Anchor,
    Container,
    Table,
    TableCaption,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
} from '@mantine/core';
import { useMemo, useState } from 'react';

import { usePlayers } from '@/lib/swr';
import { PlayerDataType } from '@/types';

export type Props = unknown;

type SortKey = 'id' | 'name' | 'joined' | 'finished' | 'role';
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
        default:
            return 0;
    }
};

export const AdminPlayerList: React.FC<Props> = () => {
    const players = usePlayers();
    const [sortKey, setSortKey] = useState<SortKey>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

    const sortedPlayers = useMemo(() => {
        const data = [...players];
        data.sort((a, b) => comparePlayers(a, b, sortKey, sortDirection));
        return data;
    }, [players, sortKey, sortDirection]);

    const getSortLabel = (label: string, key: SortKey) => {
        if (key !== sortKey) return label;
        return sortDirection === 'asc' ? `${label} ▲` : `${label} ▼`;
    };

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

        return (
            <TableTr key={player.id}>
                <TableTd>
                    <Anchor href={playerHref}>{player.id}</Anchor>
                </TableTd>
                <TableTd>
                    <Anchor href={playerHref}>{player.name}</Anchor>
                </TableTd>
                <TableTd>{formatDate(player.joined)}</TableTd>
                <TableTd>{formatDate(player.finished)}</TableTd>
                <TableTd>{player.isAdmin ? 'Admin' : 'Player'}</TableTd>
            </TableTr>
        );
    });

    return (
        <Container>
            <Text fw={700} mb="sm" data-testid="admin-player-list-count">
                Players ({players.length})
            </Text>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <TableCaption>Registered players</TableCaption>
                <TableThead>
                    <TableTr>
                        <TableTh aria-sort={sortKey === 'id' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            <button
                                type="button"
                                onClick={() => handleSort('id')}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                            >
                                {getSortLabel('ID', 'id')}
                            </button>
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            <button
                                type="button"
                                onClick={() => handleSort('name')}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                            >
                                {getSortLabel('Name', 'name')}
                            </button>
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'joined' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            <button
                                type="button"
                                onClick={() => handleSort('joined')}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                            >
                                {getSortLabel('Joined', 'joined')}
                            </button>
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'finished' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            <button
                                type="button"
                                onClick={() => handleSort('finished')}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                            >
                                {getSortLabel('Finished', 'finished')}
                            </button>
                        </TableTh>
                        <TableTh aria-sort={sortKey === 'role' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                            <button
                                type="button"
                                onClick={() => handleSort('role')}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                            >
                                {getSortLabel('Role', 'role')}
                            </button>
                        </TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
            </Table>
        </Container>
    );
};

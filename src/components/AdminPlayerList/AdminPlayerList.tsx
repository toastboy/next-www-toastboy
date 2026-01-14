'use client';

import {
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

import { usePlayers } from '@/lib/swr';
import { PlayerDataType } from '@/types';

export type Props = unknown;

const formatDate = (value: Date | string | null | undefined) => {
    if (value == null) return '-';
    return new Date(value).toLocaleDateString('sv');
};

export const AdminPlayerList: React.FC<Props> = () => {
    const players = usePlayers();

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

    const rows = players.map((player: PlayerDataType) => (
        <TableTr key={player.id}>
            <TableTd>{player.id}</TableTd>
            <TableTd>{player.name}</TableTd>
            <TableTd>{formatDate(player.joined)}</TableTd>
            <TableTd>{formatDate(player.finished)}</TableTd>
            <TableTd>{player.isAdmin ? 'Admin' : 'Player'}</TableTd>
        </TableTr>
    ));

    return (
        <Container>
            <Text fw={700} mb="sm" data-testid="admin-player-list-count">
                Players ({players.length})
            </Text>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <TableCaption>Registered players</TableCaption>
                <TableThead>
                    <TableTr>
                        <TableTh>ID</TableTh>
                        <TableTh>Name</TableTh>
                        <TableTh>Joined</TableTh>
                        <TableTh>Finished</TableTh>
                        <TableTh>Role</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
            </Table>
        </Container>
    );
};

'use client';

import type { TitleOrder } from '@mantine/core';
import { Divider, Paper, Table, Title } from '@mantine/core';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { getYearName } from '@/lib/tables';
import type { PlayerDisplayType } from '@/services/Player';

export interface Props {
    player: PlayerDisplayType;
    year: number;
    record: PlayerRecordType | null;
    titleOrder?: TitleOrder;
}

export const PlayerResults = ({
    player,
    year,
    record,
    titleOrder = 3,
}: Props) => {
    return (
        <Paper
            p="sm"
            miw="14rem"
            h="100%"
        >
            <Title
                order={titleOrder}
                mb="xs"
                w="100%"
                ta="center"
            >
                Results
            </Title>
            <Divider mb="xs" />
            <Table
                summary={`${player.name}'s ${getYearName(year)} results record`}
                layout="fixed"
            >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th>Played</Table.Th>
                        <Table.Td w="3rem">{record?.played ?? '-'}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Won</Table.Th>
                        <Table.Td w="3rem">{record?.won ?? '-'}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Drawn</Table.Th>
                        <Table.Td w="3rem">{record?.drawn ?? '-'}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Lost</Table.Th>
                        <Table.Td w="3rem">{record?.lost ?? '-'}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Paper>
    );
};

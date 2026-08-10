'use client';

import type { TitleOrder } from '@mantine/core';
import { Anchor, Divider, Paper, Table, Title } from '@mantine/core';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { getYearName, rankMap } from '@/lib/tables';
import { PlayerDisplayType } from '@/services/Player';

export interface Props {
    player: PlayerDisplayType;
    year: number;
    record: PlayerRecordType | null;
    titleOrder?: TitleOrder;
}

export const PlayerPositions = ({
    player,
    year,
    record,
    titleOrder = 3,
}: Props) => {
    return (
        <Paper p="sm" miw="14rem" h="100%">
            <Title order={titleOrder} mb="xs" w="100%" ta="center">
                Positions
            </Title>
            <Divider mb="xs" />
            <Table
                summary={`${player.name}'s ${getYearName(year)} table positions`}
                layout="fixed"
            >
                <Table.Tbody>
                    {TableNameSchema.options.map((table) => {
                        const position = record
                            ? (record[
                                  rankMap[table][0] as keyof typeof record
                              ] ?? null)
                            : null;
                        const href = `/footy/table/${table}?year=${year}`;

                        return (
                            <Table.Tr key={table}>
                                <Table.Th>
                                    <Anchor href={href}>
                                        {table.charAt(0).toUpperCase() +
                                            table.slice(1)}
                                    </Anchor>
                                </Table.Th>
                                <Table.Td w="3rem">
                                    {position !== null ? (
                                        <Anchor href={href}>{position}</Anchor>
                                    ) : (
                                        '-'
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                </Table.Tbody>
            </Table>
        </Paper>
    );
};

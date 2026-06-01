import { Divider, Paper, Table, TableTbody, TableTd, TableTh, TableTr, Title } from '@mantine/core';
import { TableNameSchema } from 'prisma/zod/schemas';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { getYearName, rankMap } from '@/lib/tables';
import { PlayerDisplayType } from '@/services/Player';

export interface Props {
    player: PlayerDisplayType;
    year: number;
    record: PlayerRecordType | null;
}

export const PlayerPositions = ({ player, year, record }: Props) => {
    return (
        <Paper shadow="xs" p="sm" w="14rem" withBorder>
            <Title order={3} mb="xs" w="100%" ta="center">Positions</Title>
            <Divider mb="xs" />
            <Table
                summary={`${player.name}'s ${getYearName(year)} table positions`}
                layout="fixed"
            >
                <TableTbody>
                    {TableNameSchema.options.map((table) => {
                        const position = record ?
                            record[rankMap[table][0] as keyof typeof record] ?? null :
                            null;

                        return (
                            <TableTr key={table}>
                                <TableTh>{table.charAt(0).toUpperCase() + table.slice(1)}</TableTh>
                                <TableTd w="3rem">{position ?? '-'}</TableTd>
                            </TableTr>
                        );
                    })}
                </TableTbody>
            </Table>
        </Paper>
    );
};

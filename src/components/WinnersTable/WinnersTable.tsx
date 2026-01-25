import { Paper, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from '@mantine/core';
import type { TableName } from 'prisma/zod/schemas';
import { Activity } from 'react';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    records: PlayerRecordDataType[];
}

export const WinnersTable: React.FC<Props> = ({ table, records }) => {
    const rows = records.map((winner, index) => {
        const year = index > 0 && records[index - 1].year === winner.year ? '' : winner.year;
        return (
            <TableTr key={index}>
                <TableTd>{year}</TableTd>
                <TableTd><PlayerLink player={winner.player} year={winner.year} /></TableTd>
            </TableTr>
        );
    });

    return (
        <Activity mode={rows.length > 0 ? 'visible' : 'hidden'}>
            <Paper shadow="xl" p="lg" w="16em">
                <Title order={3}>{table.charAt(0).toUpperCase() + table.slice(1)}</Title>

                <Table>
                    <TableThead>
                        <TableTr>
                            <TableTh w="4em">Year</TableTh>
                            <TableTh w="auto">Winner(s)</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {rows}
                    </TableTbody>
                </Table>
            </Paper>
        </Activity>
    );
};

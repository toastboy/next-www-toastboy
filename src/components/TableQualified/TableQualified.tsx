import { Flex, Table, TableTbody, TableTd, TableTr, Title } from '@mantine/core';
import type { TableName } from 'prisma/zod/schemas';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { TableScore } from '@/components/TableScore/TableScore';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    title?: string;
    year: number;
    records: PlayerRecordDataType[];
}

export const TableQualified: React.FC<Props> = ({ table, title, year, records }) => {
    return (
        <Flex direction="column" gap="md">
            <Title order={1}>{title}</Title>
            <Table>
                <TableTbody>
                    {records.map((record, index) => (
                        <TableTr key={index}>
                            <TableTd>
                                <PlayerLink player={record.player} year={year} />
                            </TableTd>
                            <TableTd>
                                <TableScore table={table} playerRecord={record} /></TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </Flex>
    );
};

import { Flex, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';
import { type TableName, TableNameSchema } from 'prisma/zod/schemas';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { TableScore } from '@/components/TableScore/TableScore';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    year: number;
    records: PlayerRecordDataType[];
}

const rankFieldByTable = {
    [TableNameSchema.enum.points]: 'rankPoints',
    [TableNameSchema.enum.averages]: 'rankAverages',
    [TableNameSchema.enum.stalwart]: 'rankStalwart',
    [TableNameSchema.enum.speedy]: 'rankSpeedy',
    [TableNameSchema.enum.pub]: 'rankPub',
} satisfies Record<TableName, keyof PlayerRecordDataType>;

const scoreHeadingByTable = {
    [TableNameSchema.enum.points]: 'Points',
    [TableNameSchema.enum.averages]: 'Average',
    [TableNameSchema.enum.stalwart]: 'Games Played',
    [TableNameSchema.enum.speedy]: 'Average Response Time (hh:mm:ss)',
    [TableNameSchema.enum.pub]: 'Pub Score',
} satisfies Record<TableName, string>;

export const RecordsTable = ({ table, year, records }: Props) => {
    const rankField = rankFieldByTable[table];
    const scoreHeading = scoreHeadingByTable[table];

    return (
        <Flex direction="column" gap="md">
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>Position</TableTh>
                        <TableTh>Player</TableTh>
                        <TableTh>{scoreHeading}</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>
                    {records.map((record) => (
                        <TableTr key={record.id}>
                            <TableTd>
                                {record[rankField] ?? '-'}
                            </TableTd>
                            <TableTd>
                                <PlayerLink player={record.player} year={year} />
                            </TableTd>
                            <TableTd>
                                <TableScore table={table} playerRecord={record} />
                            </TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
        </Flex>
    );
};

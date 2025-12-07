import { Paper, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from '@mantine/core';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import { TableName } from 'prisma/generated/schemas';

import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    records: PlayerRecordDataType[];
}

const WinnersTable: React.FC<Props> = ({ table, records }) => {
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
        <Paper shadow="xl" p="lg" w="16em">
            <Title order={3}>{table.charAt(0).toUpperCase() + table.slice(1)}</Title>

            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh w="4em">Year</TableTh>
                        <TableTh w="auto">Winner(s)</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
            </Table>
        </Paper>
    );
};

export default WinnersTable;

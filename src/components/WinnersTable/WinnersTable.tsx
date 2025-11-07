import { Paper, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from '@mantine/core';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import { TableName } from 'prisma/generated/schemas';
import playerRecordService from 'services/PlayerRecord';

export interface Props {
    table: TableName;
    year?: number;
}

const WinnersTable: React.FC<Props> = async ({ table, year }) => {
    const record = await playerRecordService.getWinners(table, year && year > 0 ? year : undefined);

    const rows = record.map((winner, index) => {
        const year = index > 0 && record[index - 1].year === winner.year ? '' : winner.year;
        return (
            <TableTr key={index}>
                <TableTd>{year}</TableTd>
                <TableTd><PlayerLink playerId={winner.playerId} year={winner.year} /></TableTd>
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

import { Paper, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from '@mantine/core';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import { TableNameType } from 'prisma/generated/zod';
import playerRecordService from 'services/PlayerRecord';

export interface Props {
    table: TableNameType;
    year?: number;
}

const WinnersTable: React.FC<Props> = async ({ table, year }) => {
    const record = await playerRecordService.getWinners(table, year && year > 0 ? year : undefined);
    let currentYear: number;

    const rows = record.map((winner, index) => {
        const year = winner.year == currentYear ? '' : (currentYear = winner.year);
        return (
            <TableTr key={index}>
                <TableTd>{year}</TableTd>
                <TableTd><PlayerLink playerId={winner.playerId} year={currentYear} /></TableTd>
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

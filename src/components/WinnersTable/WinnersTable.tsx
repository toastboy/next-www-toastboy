import { Paper, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from '@mantine/core';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import { fetchData } from 'lib/fetch';
import { PlayerRecordWithPlayer, TableName } from 'lib/types';

export interface Props {
    table: TableName;
    year?: number;
}

const WinnersTable: React.FC<Props> = async ({ table, year }) => {
    const record = await fetchData<PlayerRecordWithPlayer[]>(`/api/footy/winners/${table}/${year || ''}`);
    let currentyear: number;

    const rows = record.map((winner, index) => {
        const year = winner.year == currentyear ? '' : (currentyear = winner.year);
        return (
            <TableTr key={index}>
                <TableTd>{year}</TableTd>
                <TableTd><PlayerLink player={winner.player} year={currentyear} /></TableTd>
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

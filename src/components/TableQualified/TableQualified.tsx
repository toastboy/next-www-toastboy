import { Flex, Table, TableTbody, TableTd, TableTr, Title } from '@mantine/core';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import TableScore from 'components/TableScore/TableScore';
import { fetchData } from 'lib/fetch';
import { PlayerRecordWithPlayer, TableName } from 'lib/types';

export interface Props {
    table: TableName;
    title?: string;
    year: number;
    qualified?: boolean;
    take?: number;
}

const TableQualified: React.FC<Props> = async ({ table, title, year, qualified, take }) => {
    const data = await fetchData<PlayerRecordWithPlayer[]>(`/api/footy/table/${table}/${year}${qualified ? `/qualified` : ''}${take ? `/${take}` : ''}`);

    if (!data) return <></>;

    return (
        <Flex direction="column" gap="md">
            <Title order={1}>{title}</Title>
            <Table>
                <TableTbody>
                    {data.map((record, index) => (
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

export default TableQualified;

'use client';

import { Loader, Table, Title } from '@mantine/core';
import PlayerLink from 'components/PlayerLink';
import { FootyTable, useWinners } from 'lib/swr';
import { getYearName } from 'lib/utils';

interface WinnersTableProps {
    table: FootyTable;
    year?: number;
}

const WinnersTable: React.FC<WinnersTableProps> = ({ table, year }) => {
    const { data, error, isLoading } = useWinners(table, year);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!data) return null;

    const rows = data.map((winner, index) => (
        <Table.Tr key={index}>
            <Table.Td>{getYearName(winner.year)}</Table.Td>
            <Table.Td><PlayerLink idOrLogin={winner.playerId.toString()} /></Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Title order={3}>{table.charAt(0).toUpperCase() + table.slice(1)}</Title>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Year</Table.Th>
                        <Table.Th>Winner(s)</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>
    );
};

export default WinnersTable;

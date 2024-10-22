'use client';

import { Loader, Table } from '@mantine/core';
import { useTurnoutByYear } from 'lib/swr';

type TurnoutProps = object

const Turnout: React.FC<TurnoutProps> = () => {
    const { data, error, isLoading } = useTurnoutByYear();

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length === 0) return <div>failed to load</div>;

    const rows = data.map((t) => (
        <Table.Tr key={t.year}>
            <Table.Td>{t.year}</Table.Td>
            <Table.Td>{t.gamesPlayed}</Table.Td>
            <Table.Td>{t.gamesCancelled}</Table.Td>
            <Table.Td>{t.responsesPerGameInitiated.toFixed(1)}</Table.Td>
            <Table.Td>{t.yessesPerGameInitiated.toFixed(1)}</Table.Td>
            <Table.Td>{t.playersPerGamePlayed.toFixed(1)}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Year</Table.Th>
                    <Table.Th>Played</Table.Th>
                    <Table.Th>Cancelled</Table.Th>
                    <Table.Th>Response Rate</Table.Th>
                    <Table.Th>Yes Rate</Table.Th>
                    <Table.Th>Turnout Rate</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
};

export default Turnout;

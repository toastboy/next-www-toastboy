'use client';

import { Loader } from '@mantine/core';
import PlayerLink from 'components/PlayerLink';
import { getYearName } from 'lib/utils';
import { FootyTable, useWinners } from 'lib/swr';

interface WinnersTableProps {
    table: FootyTable;
    year?: number;
}

const WinnersTable: React.FC<WinnersTableProps> = ({ table, year }) => {
    const { data, error, isLoading } = useWinners(table, year);

    if (error) return <div>failed to load</div>;
    if (isLoading) return <Loader color="gray" type="dots" />;
    if (!data) return null;

    return (
        <table>
            <caption>{table.charAt(0).toUpperCase() + table.slice(1)}</caption>
            <tbody>
                {data.map((winner, index) => (
                    <tr key={index}>
                        <th>
                            {getYearName(winner.year)}
                        </th>
                        <td>
                            <PlayerLink idOrLogin={winner.playerId.toString()} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default WinnersTable;

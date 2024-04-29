'use client';

import { Loader } from '@mantine/core';
import PlayerLink from 'components/PlayerLink';
import { getYearName } from 'lib/utils';
import { EnumTable } from 'services/PlayerRecord';
import { useWinners } from 'use/winners';

export default function WinnersTable({ table, year }: {
    table: EnumTable,
    year?: number,
}) {
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
}

import PlayerLink from 'components/PlayerLink';
import { getYearName } from 'lib/utils';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export default async function WinnersTable({ table, year }: {
    table: EnumTable,
    year?: number,
}) {
    let winners = await playerRecordService.getWinners(table as EnumTable);

    if (year) {
        winners = winners.filter((winner) => winner.year === year);
    }

    return (
        <table>
            <caption>{table.charAt(0).toUpperCase() + table.slice(1)}</caption>
            <tbody>
                {winners.map((winner, index) => (
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

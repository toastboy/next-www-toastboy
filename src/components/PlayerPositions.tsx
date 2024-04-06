import { Player } from '@prisma/client';
import { getYearName } from 'lib/utils';
import playerService from 'services/Player';
import playerRecordService, { EnumTable } from 'services/PlayerRecord';

export default async function PlayerPositions({
    player,
    year,
}: {
    player: Player,
    year: number,
}) {
    const record = await playerRecordService.getForYearByPlayer(year, player.id);

    if (!record) {
        return null;
    }

    return (
        <div className="px-6 py-4">
            <table summary={`${playerService.getName(player)}'s ${getYearName(year)} table positions`}>
                <caption>{getYearName(year)} Positions</caption>
                <tbody>
                    {Object.keys(EnumTable).map((table) => {
                        const position = record[`rank_${table}` as keyof typeof record];
                        if (position === null) {
                            return null;
                        }
                        return (
                            <tr key={table}>
                                <th>{table.charAt(0).toUpperCase() + table.slice(1)}</th>
                                <td>{position}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

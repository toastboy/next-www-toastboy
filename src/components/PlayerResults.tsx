import { Player } from '@prisma/client';
import { getYearName } from 'lib/utils';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';

export default async function PlayerResults({
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
            <table summary={`${playerService.getName(player)}'s ${getYearName(year)} results record`}>
                <caption>{getYearName(year)} Results</caption>
                <tbody>
                    <tr><th>Played</th><td>{record.P}</td></tr>
                    <tr><th>Won</th><td>{record.W}</td></tr>
                    <tr><th>Drawn</th><td>{record.D}</td></tr>
                    <tr><th>Lost</th><td>{record.L}</td></tr>
                </tbody>
            </table>
        </div>
    );
}

import { fetchData } from 'lib/fetch';
import { Player, PlayerRecordWithPlayer } from 'lib/types';
import { getYearName } from 'lib/utils';

export interface Props {
    player: Player;
    year: number;
}

const PlayerResults: React.FC<Props> = async ({ player, year }) => {
    const playerRecord = await fetchData<PlayerRecordWithPlayer>(`/api/footy/player/${player.id}/record/${year}`);

    return (
        // TODO Mantine Table
        <div className="px-6 py-4">
            <table summary={`${player.name}'s ${getYearName(year)} results record`}>
                <caption>{getYearName(year)} Results</caption>
                <tbody>
                    <tr><th>Played</th><td>{playerRecord.played}</td></tr>
                    <tr><th>Won</th><td>{playerRecord.won}</td></tr>
                    <tr><th>Drawn</th><td>{playerRecord.drawn}</td></tr>
                    <tr><th>Lost</th><td>{playerRecord.lost}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlayerResults;

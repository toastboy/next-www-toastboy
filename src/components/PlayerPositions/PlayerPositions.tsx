import { fetchData } from 'lib/fetch';
import { Player, PlayerRecord, TableName } from 'lib/types';
import { getYearName, rankMap } from 'lib/utils';

export interface Props {
    player: Player;
    year: number;
}

const PlayerPositions: React.FC<Props> = async ({ player, year }) => {
    const playerRecord = await fetchData<PlayerRecord>(`/api/footy/player/${player.id}/record/${year}`);

    return (
        <div className="px-6 py-4">
            <table summary={`${player.name}'s ${getYearName(year)} table positions`}>
                <caption>{getYearName(year)} Positions</caption>
                <tbody>
                    {Object.keys(TableName).map((table) => {
                        const position = playerRecord[rankMap[table as TableName] as keyof typeof playerRecord];

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
};

export default PlayerPositions;

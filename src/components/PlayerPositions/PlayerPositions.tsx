import { Table, TableCaption, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
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
        <Table summary={`${player.name}'s ${getYearName(year)} table positions`}>
            <TableCaption>{getYearName(year)} Positions</TableCaption>
            <TableTbody>
                {Object.keys(TableName).map((table) => {
                    const position = playerRecord[rankMap[table as TableName] as keyof typeof playerRecord] || null;

                    return (
                        <TableTr key={table}>
                            <TableTh>{table.charAt(0).toUpperCase() + table.slice(1)}</TableTh>
                            <TableTd>{position || '-'}</TableTd>
                        </TableTr>
                    );
                })}
            </TableTbody>
        </Table>
    );
};

export default PlayerPositions;

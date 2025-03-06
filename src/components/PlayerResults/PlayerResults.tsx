import { Table, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
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
        <Table summary={`${player.name}'s ${getYearName(year)} results record`}>
            <caption>{getYearName(year)} Results</caption>
            <TableTbody>
                <TableTr><TableTh>Played</TableTh><TableTd>{playerRecord.played || '-'}</TableTd></TableTr>
                <TableTr><TableTh>Won</TableTh><TableTd>{playerRecord.won || '-'}</TableTd></TableTr>
                <TableTr><TableTh>Drawn</TableTh><TableTd>{playerRecord.drawn || '-'}</TableTd></TableTr>
                <TableTr><TableTh>Lost</TableTh><TableTd>{playerRecord.lost || '-'}</TableTd></TableTr>
            </TableTbody>
        </Table>
    );
};

export default PlayerResults;

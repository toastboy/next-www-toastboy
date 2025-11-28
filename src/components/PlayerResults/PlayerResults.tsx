import { Table, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
import { getYearName } from 'lib/utils';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';

export interface Props {
    playerId: number;
    year: number;
}

const PlayerResults: React.FC<Props> = async ({ playerId, year }) => {
    const player = await playerService.getById(playerId);

    if (!player) return null;

    const playerRecord = await playerRecordService.getForYearByPlayer(year, playerId);

    return (
        <Table summary={`${player.name ?? 'Unknown Player'}'s ${getYearName(year)} results record`}>
            <caption>{getYearName(year)} Results</caption>
            <TableTbody>
                <TableTr><TableTh>Played</TableTh><TableTd>{playerRecord?.played ?? '-'}</TableTd></TableTr>
                <TableTr><TableTh>Won</TableTh><TableTd>{playerRecord?.won ?? '-'}</TableTd></TableTr>
                <TableTr><TableTh>Drawn</TableTh><TableTd>{playerRecord?.drawn ?? '-'}</TableTd></TableTr>
                <TableTr><TableTh>Lost</TableTh><TableTd>{playerRecord?.lost ?? '-'}</TableTd></TableTr>
            </TableTbody>
        </Table>
    );
};

export default PlayerResults;

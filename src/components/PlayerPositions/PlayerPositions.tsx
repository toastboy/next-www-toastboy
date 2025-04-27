import { Table, TableCaption, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
import { getYearName, rankMap } from 'lib/utils';
import { TableNameSchema } from 'prisma/generated/zod';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';

export interface Props {
    playerId: number;
    year: number;
}

const PlayerPositions: React.FC<Props> = async ({ playerId, year }) => {
    const player = await playerService.getById(playerId);

    if (!player) return <></>;

    const playerRecord = await playerRecordService.getForYearByPlayer(year, player.id);

    return (
        <Table summary={`${player.name}'s ${getYearName(year)} table positions`}>
            <TableCaption>{getYearName(year)} Positions</TableCaption>
            <TableTbody>
                {TableNameSchema.options.map((table) => {
                    const position = playerRecord
                        ? playerRecord[rankMap[table] as keyof typeof playerRecord] || null
                        : null;

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

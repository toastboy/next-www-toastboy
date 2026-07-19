import type { TitleOrder } from '@mantine/core';
import {
    Divider,
    Paper,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableTr,
    Title,
} from '@mantine/core';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { getYearName } from '@/lib/tables';
import { PlayerDisplayType } from '@/services/Player';


export interface Props {
    player: PlayerDisplayType;
    year: number;
    record: PlayerRecordType | null;
    titleOrder?: TitleOrder;
}

export const PlayerResults = ({ player, year, record, titleOrder = 3 }: Props) => {
    return (
        <Paper p="sm" miw="14rem" h="100%" withBorder>
            <Title order={titleOrder} mb="xs" w="100%" ta="center">Results</Title>
            <Divider mb="xs" />
            <Table
                summary={`${player.name}'s ${getYearName(year)} results record`}
                layout="fixed"
            >
                <TableTbody>
                    <TableTr><TableTh>Played</TableTh><TableTd w="3rem">{record?.played ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTh>Won</TableTh><TableTd w="3rem">{record?.won ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTh>Drawn</TableTh><TableTd w="3rem">{record?.drawn ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTh>Lost</TableTh><TableTd w="3rem">{record?.lost ?? '-'}</TableTd></TableTr>
                </TableTbody>
            </Table>
        </Paper>
    );
};

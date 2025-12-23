import { Table, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { getYearName } from '@/lib/utils';

export interface Props {
    playerName: string;
    year: number;
    record: PlayerRecordType | null;
}

export const PlayerResults: React.FC<Props> = ({ playerName, year, record }) => {
    return (
        <Table summary={`${playerName}'s ${getYearName(year)} results record`}>
            <caption>{getYearName(year)} Results</caption>
            <TableTbody>
                <TableTr><TableTh>Played</TableTh><TableTd>{record?.played ?? '-'}</TableTd></TableTr>
                <TableTr><TableTh>Won</TableTh><TableTd>{record?.won ?? '-'}</TableTd></TableTr>
                <TableTr><TableTh>Drawn</TableTh><TableTd>{record?.drawn ?? '-'}</TableTd></TableTr>
                <TableTr><TableTh>Lost</TableTh><TableTd>{record?.lost ?? '-'}</TableTd></TableTr>
            </TableTbody>
        </Table>
    );
};

import { Table, TableCaption, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
import { TableNameSchema } from 'prisma/zod/schemas';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { getYearName, rankMap } from '@/lib/utils';

export interface Props {
    playerName: string;
    year: number;
    record: PlayerRecordType | null;
}

export const PlayerPositions: React.FC<Props> = ({ playerName, year, record }) => {
    return (
        <Table summary={`${playerName}'s ${getYearName(year)} table positions`}>
            <TableCaption>{getYearName(year)} Positions</TableCaption>
            <TableTbody>
                {TableNameSchema.options.map((table) => {
                    const position = record
                        ? record[rankMap[table][0] as keyof typeof record] ?? null
                        : null;

                    return (
                        <TableTr key={table}>
                            <TableTh>{table.charAt(0).toUpperCase() + table.slice(1)}</TableTh>
                            <TableTd>{position ?? '-'}</TableTd>
                        </TableTr>
                    );
                })}
            </TableTbody>
        </Table>
    );
};

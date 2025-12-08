import { Table, TableCaption, TableTbody, TableTd, TableTh, TableTr } from '@mantine/core';
import { getYearName, rankMap } from 'lib/utils';
import { TableNameSchema } from 'prisma/generated/schemas';
import { PlayerRecordType } from 'prisma/generated/schemas/models/PlayerRecord.schema';

export interface Props {
    playerName: string;
    year: number;
    record: PlayerRecordType | null;
}

const PlayerPositions: React.FC<Props> = ({ playerName, year, record }) => {
    return (
        <Table summary={`${playerName}'s ${getYearName(year)} table positions`}>
            <TableCaption>{getYearName(year)} Positions</TableCaption>
            <TableTbody>
                {TableNameSchema.options.map((table) => {
                    const position = record
                        ? record[rankMap[table] as keyof typeof record] ?? null
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

export default PlayerPositions;

import { Table, TableTbody, TableTd, TableTr } from '@mantine/core';
import { ArseType } from 'prisma/zod/schemas/models/Arse.schema';

export interface Props {
    arse: Partial<ArseType> | null;
}

export const PlayerArse: React.FC<Props> = ({ arse }) => {
    return (
        <Table>
            <TableTbody>
                <TableTr><TableTd>In Goal</TableTd><TableTd>{arse?.inGoal ?? '-'}</TableTd></TableTr>
                <TableTr><TableTd>Running</TableTd><TableTd>{arse?.running ?? '-'}</TableTd></TableTr>
                <TableTr><TableTd>Shooting</TableTd><TableTd>{arse?.shooting ?? '-'}</TableTd></TableTr>
                <TableTr><TableTd>Passing</TableTd><TableTd>{arse?.passing ?? '-'}</TableTd></TableTr>
                <TableTr><TableTd>Ball Skill</TableTd><TableTd>{arse?.ballSkill ?? '-'}</TableTd></TableTr>
                <TableTr><TableTd>Attacking</TableTd><TableTd>{arse?.attacking ?? '-'}</TableTd></TableTr>
                <TableTr><TableTd>Defending</TableTd><TableTd>{arse?.defending ?? '-'}</TableTd></TableTr>
            </TableTbody>
        </Table>
    );
};

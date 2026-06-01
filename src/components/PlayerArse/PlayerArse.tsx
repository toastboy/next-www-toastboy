import { Divider, Paper, Table, TableTbody, TableTd, TableTr, Title } from '@mantine/core';
import type { ArseType } from 'prisma/zod/schemas/models/Arse.schema';

export interface Props {
    arse: Partial<ArseType> | null;
}

export const PlayerArse = ({ arse }: Props) => {
    if (!arse) return null;

    return (
        <Paper shadow="xs" p="sm" w="14rem" withBorder>
            <Title order={3} mb="xs" w="100%" ta="center">Arse</Title>
            <Divider mb="xs" />
            <Table
                summary={`Anonymous Ratings System Exponent`}
                layout="fixed"
            >
                <TableTbody>
                    <TableTr><TableTd>In Goal</TableTd><TableTd w="3rem">{arse.inGoal ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTd>Running</TableTd><TableTd w="3rem">{arse.running ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTd>Shooting</TableTd><TableTd w="3rem">{arse.shooting ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTd>Passing</TableTd><TableTd w="3rem">{arse.passing ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTd>Ball Skill</TableTd><TableTd w="3rem">{arse.ballSkill ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTd>Attacking</TableTd><TableTd w="3rem">{arse.attacking ?? '-'}</TableTd></TableTr>
                    <TableTr><TableTd>Defending</TableTd><TableTd w="3rem">{arse.defending ?? '-'}</TableTd></TableTr>
                </TableTbody>
            </Table>
        </Paper>
    );
};

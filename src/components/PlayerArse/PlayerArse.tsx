import { Table, TableTbody, TableTd, TableTr } from '@mantine/core';
import { getUserRole } from 'lib/authServer';
import arseService from 'services/Arse';

export interface Props {
    playerId: number;
}

const PlayerArse: React.FC<Props> = async ({ playerId }) => {
    if (await getUserRole() !== 'admin') return <></>;

    const arse = await arseService.getByPlayer(playerId);

    return (
        <Table>
            <TableTbody>
                <TableTr><TableTd>In Goal</TableTd><TableTd>{arse?.inGoal || '-'}</TableTd></TableTr>
                <TableTr><TableTd>Running</TableTd><TableTd>{arse?.running || '-'}</TableTd></TableTr>
                <TableTr><TableTd>Shooting</TableTd><TableTd>{arse?.shooting || '-'}</TableTd></TableTr>
                <TableTr><TableTd>Passing</TableTd><TableTd>{arse?.passing || '-'}</TableTd></TableTr>
                <TableTr><TableTd>Ball Skill</TableTd><TableTd>{arse?.ballSkill || '-'}</TableTd></TableTr>
                <TableTr><TableTd>Attacking</TableTd><TableTd>{arse?.attacking || '-'}</TableTd></TableTr>
                <TableTr><TableTd>Defending</TableTd><TableTd>{arse?.defending || '-'}</TableTd></TableTr>
            </TableTbody>
        </Table>
    );
};

export default PlayerArse;

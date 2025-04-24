import { Table, TableTbody, TableTd, TableTr } from '@mantine/core';
import { getUserRole } from 'lib/authServer';
import { fetchData } from 'lib/fetch';
import { Arse, Player } from 'lib/types';

export interface Props {
    player: Player,
}

const PlayerArse: React.FC<Props> = async ({ player }) => {
    if (await getUserRole() !== 'admin') {
        return <></>;
    }

    const arse = await fetchData<Arse>(`/api/footy/player/${player.id}/arse`);

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

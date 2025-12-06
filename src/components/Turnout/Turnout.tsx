import { Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';
import { TurnoutByYearType } from 'types';

interface Props {
    turnout: TurnoutByYearType[],
}

const Turnout: React.FC<Props> = ({ turnout }) => {
    const rows = turnout.sort((a, b) => b.year - a.year).map((t) => (
        <TableTr key={t.year}>
            <TableTd>{t.year}</TableTd>
            <TableTd>{t.gamesPlayed}</TableTd>
            <TableTd>{t.gamesCancelled}</TableTd>
            <TableTd>{t.responsesPerGameInitiated.toFixed(1)}</TableTd>
            <TableTd>{t.yessesPerGameInitiated.toFixed(1)}</TableTd>
            <TableTd>{t.playersPerGamePlayed.toFixed(1)}</TableTd>
        </TableTr>
    ));

    return (
        <Table>
            <TableThead>
                <TableTr>
                    <TableTh>Year</TableTh>
                    <TableTh>Played</TableTh>
                    <TableTh>Cancelled</TableTh>
                    <TableTh>Response Rate</TableTh>
                    <TableTh>Yes Rate</TableTh>
                    <TableTh>Turnout Rate</TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>{rows}</TableTbody>
        </Table>
    );
};

export default Turnout;

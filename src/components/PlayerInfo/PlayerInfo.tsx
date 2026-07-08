import {
    Divider,
    Paper,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableTr,
    Title,
    type TitleOrder,
} from '@mantine/core';

import { EmailPlayerButton } from '@/components/EmailPlayerButton/EmailPlayerButton';
import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { formatDate } from '@/lib/dates';
import { PlayerDisplayType } from '@/services/Player';
import type { SendEmailProxy } from '@/types/actions/SendEmail';
import type { PlayerDataEmailDisplayType } from '@/types/PlayerDataType';
import type { PlayerFormType } from '@/types/PlayerFormType';

export interface Props {
    player: PlayerDisplayType;
    year: number;
    introducedBy?: PlayerDisplayType | null;
    lastPlayed: PlayerFormType | null;
    lastWon: PlayerFormType | null;
    isAuthenticated?: boolean;
    isAdmin?: boolean;
    playerData?: PlayerDataEmailDisplayType | null;
    onSendEmail?: SendEmailProxy;
    titleOrder?: TitleOrder;
}

export const PlayerInfo = ({
    player,
    year,
    introducedBy,
    lastPlayed,
    lastWon,
    isAuthenticated,
    isAdmin,
    playerData,
    onSendEmail,
    titleOrder = 3,
}: Props) => {
    return (
        <Paper shadow="xs" p="sm" miw="18rem" h="100%" withBorder>
            <Title order={titleOrder} mb="xs" w="100%" ta="center">Info</Title>
            <Divider mb="xs" />
            <Table
                layout="fixed"
                variant="vertical"
            >
                <TableTbody>
                    {!!introducedBy && (
                        <TableTr>
                            <TableTh>Introduced by</TableTh>
                            <TableTd><PlayerLink player={introducedBy} year={year} /></TableTd>
                        </TableTr>
                    )}
                    <TableTr>
                        <TableTh>Joined</TableTh>
                        <TableTd>{player.joined ? formatDate(player.joined) : 'N/A'}</TableTd>
                    </TableTr>
                    {!!isAdmin && !!playerData && !!onSendEmail && (
                        <TableTr>
                            <TableTh>Email</TableTh>
                            <TableTd>
                                <EmailPlayerButton player={playerData} onSendEmail={onSendEmail} />
                            </TableTd>
                        </TableTr>
                    )}
                    <TableTr>
                        <TableTh>Last played</TableTh>
                        <TableTd><GameDayLink gameDay={lastPlayed?.gameDay} /></TableTd>
                    </TableTr>
                    <TableTr>
                        <TableTh>Last won</TableTh>
                        <TableTd><GameDayLink gameDay={lastWon?.gameDay} /></TableTd>
                    </TableTr>
                    {!!isAuthenticated && (
                        <TableTr>
                            <TableTh>Born</TableTh>
                            <TableTd>{player.born}</TableTd>
                        </TableTr>
                    )}
                </TableTbody>
            </Table>
        </Paper>
    );
};

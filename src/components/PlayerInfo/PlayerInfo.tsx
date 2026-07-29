import {
    Divider,
    Paper,
    Table,
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
        <Paper p="sm" miw="18rem" h="100%" withBorder>
            <Title order={titleOrder} mb="xs" w="100%" ta="center">Info</Title>
            <Divider mb="xs" />
            <Table
                layout="fixed"
                variant="vertical"
            >
                <Table.Tbody>
                    {!!introducedBy && (
                        <Table.Tr>
                            <Table.Th>Introduced by</Table.Th>
                            <Table.Td><PlayerLink player={introducedBy} year={year} /></Table.Td>
                        </Table.Tr>
                    )}
                    <Table.Tr>
                        <Table.Th>Joined</Table.Th>
                        <Table.Td>{player.joined ? formatDate(player.joined) : 'N/A'}</Table.Td>
                    </Table.Tr>
                    {!!isAdmin && !!playerData && !!onSendEmail && (
                        <Table.Tr>
                            <Table.Th>Email</Table.Th>
                            <Table.Td>
                                <EmailPlayerButton player={playerData} onSendEmail={onSendEmail} />
                            </Table.Td>
                        </Table.Tr>
                    )}
                    <Table.Tr>
                        <Table.Th>Last played</Table.Th>
                        <Table.Td><GameDayLink gameDay={lastPlayed?.gameDay} /></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th>Last won</Table.Th>
                        <Table.Td><GameDayLink gameDay={lastWon?.gameDay} /></Table.Td>
                    </Table.Tr>
                    {!!isAuthenticated && (
                        <Table.Tr>
                            <Table.Th>Born</Table.Th>
                            <Table.Td>{player.born}</Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Paper>
    );
};

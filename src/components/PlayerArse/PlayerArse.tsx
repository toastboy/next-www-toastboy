import type { TitleOrder } from '@mantine/core';
import {
    ActionIcon,
    Divider,
    Group,
    Paper,
    Table,
    TableTbody,
    TableTd,
    TableTr,
    Title,
    Tooltip,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { ArseType } from 'prisma/zod/schemas/models/Arse.schema';

export interface Props {
    arse: Partial<ArseType> | null;
    titleOrder?: TitleOrder;
}

export const PlayerArse = ({ arse, titleOrder = 3 }: Props) => {
    if (!arse) return null;

    return (
        <Paper shadow="xs" p="sm" w="14rem" withBorder>
            <Group justify="center" gap="xs" wrap="nowrap" mb="xs">
                <Title order={titleOrder} ta="center">ARSE</Title>
                <Tooltip
                    label="Anonymous Ratings System Exponent: how other players rate this player's performance."
                    events={{ hover: true, focus: true, touch: true }}
                >
                    <ActionIcon variant="subtle" color="gray" size="sm" aria-label="About ARSE">
                        <IconInfoCircle size={16} />
                    </ActionIcon>
                </Tooltip>
            </Group>
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

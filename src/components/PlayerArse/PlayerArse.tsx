import type {
    TitleOrder,
} from '@mantine/core';
import {
    ActionIcon,
    Divider,
    Group,
    Paper,
    Table,
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
        <Paper p="sm" w="14rem" withBorder>
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
                <Table.Tbody>
                    <Table.Tr><Table.Td>In Goal</Table.Td><Table.Td w="3rem">{arse.inGoal ?? '-'}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Td>Running</Table.Td><Table.Td w="3rem">{arse.running ?? '-'}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Td>Shooting</Table.Td><Table.Td w="3rem">{arse.shooting ?? '-'}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Td>Passing</Table.Td><Table.Td w="3rem">{arse.passing ?? '-'}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Td>Ball Skill</Table.Td><Table.Td w="3rem">{arse.ballSkill ?? '-'}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Td>Attacking</Table.Td><Table.Td w="3rem">{arse.attacking ?? '-'}</Table.Td></Table.Tr>
                    <Table.Tr><Table.Td>Defending</Table.Td><Table.Td w="3rem">{arse.defending ?? '-'}</Table.Td></Table.Tr>
                </Table.Tbody>
            </Table>
        </Paper>
    );
};

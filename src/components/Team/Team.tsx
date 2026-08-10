'use client';

import { Badge, Flex, Group, Paper, Text, Title } from '@mantine/core';

import { TeamPlayer } from '@/components/TeamPlayer/TeamPlayer';
import type { TeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';

export interface Props {
    team: TeamPlayerType[];
    teamName: 'A' | 'B';
    result?: TeamResultState;
    hasBibs?: boolean;
}

const resultStyles: Record<TeamResultState, { label: string; color: string }> =
    {
        win: { label: 'Won', color: 'teal' },
        loss: { label: 'Lost', color: 'red' },
        draw: { label: 'Draw', color: 'yellow' },
        unset: { label: 'Result unset', color: 'gray' },
    };

export const Team = ({
    team,
    teamName,
    result = 'unset',
    hasBibs = false,
}: Props) => {
    return (
        <Paper p="xs">
            <Flex
                align="center"
                justify="space-between"
                gap="xs"
                p={0}
                mb="xs"
                mt={0}
            >
                <Title order={3} size="h4" fw={700}>
                    Team {teamName}
                </Title>
                <Group gap="xs">
                    {hasBibs ? <Badge color="orange">Bibs</Badge> : null}
                    <Badge color={resultStyles[result].color}>
                        {resultStyles[result].label}
                    </Badge>
                </Group>
            </Flex>
            {team.length > 0 ? (
                <Flex direction="column" gap="xs">
                    {team.map((p) => (
                        <TeamPlayer key={p.id} teamPlayer={p} />
                    ))}
                </Flex>
            ) : (
                <Text c="dimmed">No players selected.</Text>
            )}
        </Paper>
    );
};

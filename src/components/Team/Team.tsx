import { Badge, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';

import { TeamPlayer } from '@/components/TeamPlayer/TeamPlayer';
import type { TeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';

export interface Props {
    team: TeamPlayerType[];
    teamName: 'A' | 'B';
    result?: TeamResultState;
    hasBibs?: boolean;
}

const resultStyles: Record<TeamResultState, { label: string; color: string; }> = {
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
        <Paper p="md" shadow="xl" withBorder>
            <Group justify="space-between" mb="md">
                <Title order={3} fw={700}>Team {teamName}</Title>
                <Group gap="xs">
                    {hasBibs ? <Badge color="orange">Bibs</Badge> : null}
                    <Badge color={resultStyles[result].color}>
                        {resultStyles[result].label}
                    </Badge>
                </Group>
            </Group>
            {
                team.length > 0 ?
                    (
                        <SimpleGrid
                            cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
                            spacing={{ base: 'xs', lg: 'sm' }}
                        >
                            {team.map((p) => (
                                <TeamPlayer
                                    key={p.id}
                                    teamPlayer={p}
                                />
                            ))}
                        </SimpleGrid>
                    ) :
                    <Text c="dimmed">No players selected.</Text>
            }
        </Paper>
    );
};

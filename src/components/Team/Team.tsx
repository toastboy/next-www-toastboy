import { Badge, Group, Paper, SimpleGrid, Text } from '@mantine/core';

import { TeamPlayer } from '@/components/TeamPlayer/TeamPlayer';
import type { TeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';

export interface Props {
    team: TeamPlayerType[];
    teamName?: 'A' | 'B';
    result?: TeamResultState;
    hasBibs?: boolean;
}

const resultStyles: Record<TeamResultState, { label: string; color: string; }> = {
    win: { label: 'Won', color: 'teal' },
    loss: { label: 'Lost', color: 'red' },
    draw: { label: 'Draw', color: 'yellow' },
    unset: { label: 'Result unset', color: 'gray' },
};

export const Team: React.FC<Props> = ({ team, teamName = 'A', result = 'unset', hasBibs = false }) => {
    return (
        <Paper p="md" shadow="xl" withBorder>
            <Group justify="space-between" mb="md">
                <Text fw={700}>Team {teamName}</Text>
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
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
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

import { Flex, Group, SimpleGrid, Text, Title } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { Team } from '@/components/Team/Team';
import { getGameWinnersFromTeams, getTeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';

export interface Props {
    gameDay: GameDayType;
    teamA: TeamPlayerType[];
    teamB: TeamPlayerType[];
}

export const GameDaySummary = ({ gameDay, teamA, teamB }: Props) => {
    const winner = getGameWinnersFromTeams(teamA, teamB);

    if (!gameDay.game) {
        return (
            <Flex direction="column" gap="xs">
                <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
                <Text>No game {gameDay.comment ? `(${gameDay.comment})` : ''}</Text>
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap="sm">
            <Group justify="space-between">
                <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
            </Group>
            <Text>{gameDay.comment ? `(${gameDay.comment})` : ''}</Text>
            <SimpleGrid cols={{ base: 2, lg: 1 }} spacing="md">
                <Team
                    team={teamA}
                    teamName="A"
                    result={getTeamResultState('A', winner)}
                    hasBibs={gameDay.bibs === 'A'}
                />
                <Team
                    team={teamB}
                    teamName="B"
                    result={getTeamResultState('B', winner)}
                    hasBibs={gameDay.bibs === 'B'}
                />
            </SimpleGrid>
        </Flex>
    );
};

import { Badge, Flex, Group, Text, Title } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { Team } from '@/components/Team/Team';
import { type GameWinner, getGameWinnersFromTeams, getTeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';

export interface Props {
    gameDay: GameDayType;
    teamA: TeamPlayerType[];
    teamB: TeamPlayerType[];
}

const winnerLabels: Record<Exclude<GameWinner, null>, string> = {
    A: 'Team A won',
    B: 'Team B won',
    draw: 'Draw',
};

export const GameDaySummary: React.FC<Props> = ({ gameDay, teamA, teamB }) => {
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
                <Badge
                    size="lg"
                    color={winner === null ? 'gray' : winner === 'draw' ? 'yellow' : 'teal'}
                >
                    {winner === null ? 'Result not set' : winnerLabels[winner]}
                </Badge>
            </Group>
            <Text>{gameDay.comment ? `(${gameDay.comment})` : ''}</Text>
            <Text c="dimmed">Bibs: {gameDay.bibs ? `Team ${gameDay.bibs}` : 'Not set'}</Text>
            <Team
                team={teamA}
                teamName="A"
                result={getTeamResultState('A', winner)}
                hasBibs={gameDay.bibs === 'A'}
            />
            <Text fw={700} ta="center">vs.</Text>
            <Team
                team={teamB}
                teamName="B"
                result={getTeamResultState('B', winner)}
                hasBibs={gameDay.bibs === 'B'}
            />
        </Flex>
    );
};

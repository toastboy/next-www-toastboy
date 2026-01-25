import { Flex, Text, Title } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { Team } from '@/components/Team/Team';
import { TeamPlayerType } from '@/types';

export interface Props {
    gameDay: GameDayType;
    teamA: TeamPlayerType[];
    teamB: TeamPlayerType[];
}

export const GameDaySummary: React.FC<Props> = ({ gameDay, teamA, teamB }) => {
    if (!gameDay.game) {
        return (
            <Flex>
                <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
                <Text>No game {gameDay.comment ? `(${gameDay.comment})` : ''}</Text>
            </Flex>
        );
    }

    return (
        <Flex direction="column">
            <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
            <Text>{gameDay.comment ? `(${gameDay.comment})` : ''}</Text>
            <Team team={teamA} />
            <Text>vs.</Text>
            <Team team={teamB} />
        </Flex>
    );
};

import { Box, Flex, Group, SimpleGrid, Text, Title } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { Team } from '@/components/Team/Team';
import { formatDate } from '@/lib/dates';
import { getGameWinnersFromTeams, getTeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';

export interface Props {
    gameDay: GameDayType;
    prevGameDay: GameDayType | null;
    nextGameDay: GameDayType | null;
    teamA: TeamPlayerType[];
    teamB: TeamPlayerType[];
}

export const GameDaySummary = ({
    gameDay,
    prevGameDay,
    nextGameDay,
    teamA,
    teamB,
}: Props) => {
    const winner = getGameWinnersFromTeams(teamA, teamB);
    const noGame = gameDay.game ? `` : `No game`;
    const comment = gameDay.comment ? `(${gameDay.comment})` : ``;
    const maxTeamSize = Math.max(teamA.length, teamB.length);
    const navSlotWidth = '2rem';

    return (
        <Flex direction="column" gap="sm">
            <Group justify="space-between" gap="xs">
                <Box w={navSlotWidth} ta="center">
                    {prevGameDay ?
                        <GameDayLink gameDay={prevGameDay} format="left-arrow" /> :
                        <Box data-testid="game-day-prev-placeholder" aria-hidden="true" w={navSlotWidth} />}
                </Box>
                <Title order={1}>{formatDate(gameDay.date)}</Title>
                <Box w={navSlotWidth} ta="center">
                    {nextGameDay ?
                        <GameDayLink gameDay={nextGameDay} format="right-arrow" /> :
                        <Box data-testid="game-day-next-placeholder" aria-hidden="true" w={navSlotWidth} />}
                </Box>
            </Group>
            {(
                <Text ta="center">
                    {[noGame, comment].join(' ').trim()}
                </Text>
            )}
            {gameDay.game ?
                (<SimpleGrid cols={{ base: 2, lg: 1 }} spacing="md">
                    <Team
                        team={teamA}
                        teamName="A"
                        maxTeamSize={maxTeamSize}
                        result={getTeamResultState('A', winner)}
                        hasBibs={gameDay.bibs === 'A'}
                    />
                    <Team
                        team={teamB}
                        teamName="B"
                        maxTeamSize={maxTeamSize}
                        result={getTeamResultState('B', winner)}
                        hasBibs={gameDay.bibs === 'B'}
                    />
                </SimpleGrid>) : null}
        </Flex>
    );
};

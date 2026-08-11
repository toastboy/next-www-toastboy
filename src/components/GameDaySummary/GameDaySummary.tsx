'use client';

import { Box, Flex, Group, Stack, Text, Title } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { GameResultForm } from '@/components/GameResultForm/GameResultForm';
import { Team } from '@/components/Team/Team';
import { formatDate } from '@/lib/dates';
import { getGameWinnersFromTeams, getTeamResultState } from '@/lib/gameResult';
import { TeamPlayerType } from '@/types';
import { SetGameResultProxy } from '@/types/actions/SetGameResult';

export interface Props {
    gameDay: GameDayType;
    prevGameDay: GameDayType | null;
    nextGameDay: GameDayType | null;
    teamA: TeamPlayerType[];
    teamB: TeamPlayerType[];
    isAdmin: boolean;
    setGameResult: SetGameResultProxy;
}

export const GameDaySummary = ({
    gameDay,
    prevGameDay,
    nextGameDay,
    teamA,
    teamB,
    isAdmin,
    setGameResult,
}: Props) => {
    const winner = getGameWinnersFromTeams(teamA, teamB);
    const noGame = gameDay.game ? `` : `No game`;
    const comment = gameDay.comment ? `(${gameDay.comment})` : ``;
    const navSlotWidth = '2rem';

    return (
        <Flex
            direction="column"
            gap="sm"
        >
            <Group
                justify="space-between"
                gap="xs"
            >
                <Box
                    w={navSlotWidth}
                    ta="center"
                >
                    {prevGameDay ? (
                        <GameDayLink
                            gameDay={prevGameDay}
                            format="left-arrow"
                        />
                    ) : (
                        <Box
                            data-testid="game-day-prev-placeholder"
                            aria-hidden="true"
                            w={navSlotWidth}
                        />
                    )}
                </Box>
                <Title
                    order={1}
                    size="h3"
                >
                    {formatDate(gameDay.date)}
                </Title>
                <Box
                    w={navSlotWidth}
                    ta="center"
                >
                    {nextGameDay ? (
                        <GameDayLink
                            gameDay={nextGameDay}
                            format="right-arrow"
                        />
                    ) : (
                        <Box
                            data-testid="game-day-next-placeholder"
                            aria-hidden="true"
                            w={navSlotWidth}
                        />
                    )}
                </Box>
            </Group>
            {noGame || comment ? (
                <Text ta="center">{[noGame, comment].join(' ').trim()}</Text>
            ) : null}
            <Stack
                maw="fit-content"
                mx="auto"
                p="xs"
            >
                {gameDay.game ? (
                    <Flex
                        direction={{ base: 'column', xs: 'row' }}
                        justify="center"
                        gap="xs"
                    >
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
                    </Flex>
                ) : null}
                {!!isAdmin && !!gameDay.game && (
                    <GameResultForm
                        gameDayId={gameDay.id}
                        bibs={gameDay.bibs ?? null}
                        winners={winner}
                        setGameResult={setGameResult}
                    />
                )}
            </Stack>
        </Flex>
    );
};

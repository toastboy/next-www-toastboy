import { Box, List, ListItem, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';


export interface Props {
    gameDays: GameDayType[];
}

export const GameDayList = ({ gameDays }: Props) => {
    if (gameDays.length === 0) {
        return <Text c="dimmed">{`No games yet.`}</Text>;
    }

    const gameDaysByMonth = gameDays.reduce<Record<string, GameDayType[]>>((acc, gameDay) => {
        const monthKey = new Date(gameDay.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
        });
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(gameDay);
        return acc;
    }, {});

    // TODO: Abstract away the game day status indicator into a separate component
    return (
        <Stack align="stretch" justify="center" gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
                {Object.entries(gameDaysByMonth).map(([month, gameDays]) => (
                    <Paper shadow="xl" p="xl" key={month}>
                        <Text size="lg" mb="sm">
                            {month}
                        </Text>
                        <List>
                            {gameDays.map((gameDay) => (
                                <ListItem key={gameDay.id}>
                                    <GameDayLink gameDay={gameDay} format='ordinal' />
                                    <Box
                                        component="span"
                                        ml="xs"
                                        style={{
                                            display: 'inline-block',
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: (() => {
                                                const isPast = new Date(gameDay.date) < new Date();
                                                const hasGame = gameDay.game === true;
                                                const wasCancelled = gameDay.mailSent !== null && gameDay.game === false;
                                                const neverScheduled = gameDay.mailSent === null && gameDay.game === false;

                                                if (neverScheduled) {
                                                    return isPast ? 'var(--mantine-color-dark-6)' : 'transparent';
                                                }
                                                if (wasCancelled) {
                                                    return isPast ? 'var(--mantine-color-red-6)' : 'transparent';
                                                }
                                                if (hasGame) {
                                                    return isPast ? 'var(--mantine-color-green-6)' : 'transparent';
                                                }
                                                return 'transparent';
                                            })(),
                                            border: (() => {
                                                const isPast = new Date(gameDay.date) < new Date();
                                                const hasGame = gameDay.game === true;
                                                const wasCancelled = gameDay.mailSent !== null && gameDay.game === false;
                                                const neverScheduled = gameDay.mailSent === null && gameDay.game === false;

                                                if (isPast) return 'none';

                                                if (neverScheduled) {
                                                    return '2px solid var(--mantine-color-dark-6)';
                                                }
                                                if (wasCancelled) {
                                                    return '2px solid var(--mantine-color-red-6)';
                                                }
                                                if (hasGame) {
                                                    return '2px solid var(--mantine-color-green-6)';
                                                }
                                                return 'none';
                                            })(),
                                            verticalAlign: 'middle',
                                        }}
                                        data-testid={`gameday-indicator-${gameDay.id}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </SimpleGrid>
        </Stack>
    );
};

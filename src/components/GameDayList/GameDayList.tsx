import { Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayIndicator } from '../GameDayIndicator/GameDayIndicator';

export interface Props {
    gameDays: GameDayType[];
    year: number;
}

export const GameDayList = ({ gameDays, year }: Props) => {
    if (gameDays.length === 0) {
        return <Text c="dimmed">{`No games yet.`}</Text>;
    }

    const gameDaysByMonth = gameDays.reduce<Record<string, GameDayType[]>>((acc, gameDay) => {
        const monthKey = new Date(gameDay.date).toLocaleDateString('en-GB', {
            year: year === 0 ? 'numeric' : undefined,
            month: 'long',
        });
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(gameDay);
        return acc;
    }, {});

    return (
        <Stack align="stretch" justify="center" gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
                {Object.entries(gameDaysByMonth).map(([month, gameDays]) => (
                    <Paper shadow="xl" p="xl" key={month}>
                        <Text size="lg" mb="sm">
                            {month}
                        </Text>
                        <SimpleGrid cols={2} spacing="md">
                            {gameDays.map((gameDay) => (
                                <GameDayIndicator key={gameDay.id} gameDay={gameDay} />
                            ))}
                        </SimpleGrid>
                    </Paper>
                ))}
            </SimpleGrid>
        </Stack>
    );
};

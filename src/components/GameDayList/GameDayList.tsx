import { Paper, SimpleGrid, Text } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayIndicator } from '../GameDayIndicator/GameDayIndicator';

export interface Props {
    gameDays: GameDayType[];
    year: number;
}

/**
 * Renders game days grouped by month in cards that auto-fit the available width.
 * Each month card contains a fixed two-column grid of {@link GameDayIndicator}
 * items. When there are no game days, a short empty state message is shown.
 * @param props - The game days to render and the year used when formatting
 * month labels.
 * @returns A React element containing the grouped game day cards.
 */
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
        <SimpleGrid minColWidth="11rem" autoFlow="auto-fit" spacing="md" w="100%">
            {Object.entries(gameDaysByMonth).map(([month, gameDays]) => (
                <Paper p="xl" key={month} w="10rem">
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
    );
};

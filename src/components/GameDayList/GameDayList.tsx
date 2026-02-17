import { List, ListItem, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';


export interface Props {
    title: string;
    gameDays: GameDayType[];
}

export const GameDayList: React.FC<Props> = ({ title, gameDays }) => {
    if (gameDays.length === 0) {
        return <Text c="dimmed">{`No ${title} yet.`}</Text>;
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

    return (
        <Stack align="stretch" justify="center" gap="md">
            <Title>{title.charAt(0).toUpperCase() + title.slice(1)}</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
                {Object.entries(gameDaysByMonth).map(([month, gameDays]) => (
                    <Paper shadow="xl" p="xl" key={month}>
                        <Text size="lg" mb="sm">
                            {month}
                        </Text>
                        <List>
                            {gameDays.map((gameDay) => (
                                <ListItem key={gameDay.id}>
                                    <GameDayLink gameDay={gameDay} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ))}
            </SimpleGrid>
        </Stack>
    );
};

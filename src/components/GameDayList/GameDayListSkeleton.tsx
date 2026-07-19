import { Paper, SimpleGrid, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the GameDayList component layout (grid of game day cards). */
export const GameDayListSkeleton = () => (
    <Stack data-testid="skeleton-game-day-list" align="stretch" justify="center" w="100%">
        <SimpleGrid minColWidth="11rem" autoFlow="auto-fit">
            {Array.from({ length: 10 }).map((_, i) => (
                <Paper key={i} p="xl" w="10rem">
                    <Skeleton height={24} width="60%" mb="sm" />
                    <SimpleGrid cols={2}>
                        {Array.from({ length: 4 }).map((_, j) => (
                            <Skeleton key={j} height={36} radius="md" />
                        ))}
                    </SimpleGrid>
                </Paper>
            ))}
        </SimpleGrid>
    </Stack>
);

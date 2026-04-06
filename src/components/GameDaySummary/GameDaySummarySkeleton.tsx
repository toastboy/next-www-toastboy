import { Flex, Skeleton } from '@mantine/core';

/** Skeleton placeholder matching the GameDaySummary component layout (title + teams + score). */
export const GameDaySummarySkeleton = () => (
    <Flex data-testid="skeleton-game-day-summary" direction="column" gap="sm">
        <Skeleton height={36} width="60%" />
        <Skeleton height={24} width={80} />
        <Skeleton height={24} width={120} />
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`a-${i}`} height={20} width="80%" />
        ))}
        <Skeleton height={20} width={30} mx="auto" />
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`b-${i}`} height={20} width="80%" />
        ))}
    </Flex>
);

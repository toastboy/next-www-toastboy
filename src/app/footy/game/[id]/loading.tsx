import { Flex, Skeleton } from '@mantine/core';

import { GameDaySummarySkeleton } from '@/components/GameDaySummary/GameDaySummarySkeleton';
import { GameResultFormSkeleton } from '@/components/GameResultForm/GameResultFormSkeleton';

/** Skeleton placeholder matching the GamePage layout (nav links + result form + game summary). */
const Loading = () => (
    <Flex w="100%" direction="column" gap="md">
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={60} style={{ alignSelf: 'flex-end' }} />
        <GameResultFormSkeleton />
        <GameDaySummarySkeleton />
    </Flex>
);

export default Loading;

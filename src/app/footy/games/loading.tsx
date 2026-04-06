import { Flex, Skeleton } from '@mantine/core';

import { GameDayListSkeleton } from '@/components/GameDayList/GameDayListSkeleton';
import { YearSelectorSkeleton } from '@/components/YearSelector/YearSelectorSkeleton';

/** Skeleton placeholder matching the GamesPage layout (YearSelector + title + GameDayList grid). */
const Loading = () => (
    <Flex direction="column" align="center" gap="lg">
        <YearSelectorSkeleton />
        <Skeleton height={36} width={200} />
        <Skeleton height={28} width="40%" />
        <GameDayListSkeleton />
    </Flex>
);

export default Loading;

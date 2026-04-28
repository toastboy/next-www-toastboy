import { Flex, Skeleton } from '@mantine/core';

import { GameDayListSkeleton } from '@/components/GameDayList/GameDayListSkeleton';
import { TitleWithYearDropdownSkeleton } from '@/components/TitleWithYearDropdown/TitleWithYearDropdownSkeleton';

/** Skeleton placeholder matching the GamesPage layout (YearSelector + title + GameDayList grid). */
const Loading = () => (
    <Flex direction="column" align="center" gap="lg">
        <TitleWithYearDropdownSkeleton />
        <Skeleton height={36} width={200} />
        <Skeleton height={28} width="40%" />
        <GameDayListSkeleton />
    </Flex>
);

export default Loading;

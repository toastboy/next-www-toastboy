import { Flex } from '@mantine/core';

import { CurseOfTheBibsSkeleton } from '@/components/CurseOfTheBibs/CurseOfTheBibsSkeleton';
import { YearSelectorSkeleton } from '@/components/YearSelector/YearSelectorSkeleton';

/** Skeleton placeholder matching the CurseOfTheBibsPage layout (YearSelector + pie chart). */
const Loading = () => (
    <Flex direction="column" w="100%" align="center">
        <YearSelectorSkeleton />
        <CurseOfTheBibsSkeleton />
    </Flex>
);

export default Loading;

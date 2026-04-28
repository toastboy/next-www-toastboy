import { Flex } from '@mantine/core';

import { CurseOfTheBibsSkeleton } from '@/components/CurseOfTheBibs/CurseOfTheBibsSkeleton';
import { TitleWithYearDropdownSkeleton } from '@/components/TitleWithYearDropdown/TitleWithYearDropdownSkeleton';

/** Skeleton placeholder matching the CurseOfTheBibsPage layout (YearSelector + pie chart). */
const Loading = () => (
    <Flex direction="column" w="100%" align="center">
        <TitleWithYearDropdownSkeleton />
        <CurseOfTheBibsSkeleton />
    </Flex>
);

export default Loading;

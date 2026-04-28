import { Skeleton, Stack } from '@mantine/core';

import { MoneyChartSkeleton } from '@/components/MoneyChart/MoneyChartSkeleton';
import { TitleWithYearDropdownSkeleton } from '@/components/TitleWithYearDropdown/TitleWithYearDropdownSkeleton';

/** Skeleton placeholder matching the BooksPage layout (YearSelector + title + MoneyChart). */
const Loading = () => (
    <Stack align="stretch" justify="center" gap="md">
        <TitleWithYearDropdownSkeleton />
        <Skeleton height={36} width={200} mx="auto" />
        <MoneyChartSkeleton />
    </Stack>
);

export default Loading;

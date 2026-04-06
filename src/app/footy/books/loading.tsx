import { Skeleton, Stack } from '@mantine/core';

import { MoneyChartSkeleton } from '@/components/MoneyChart/MoneyChartSkeleton';
import { YearSelectorSkeleton } from '@/components/YearSelector/YearSelectorSkeleton';

/** Skeleton placeholder matching the BooksPage layout (YearSelector + title + MoneyChart). */
const Loading = () => (
    <Stack align="stretch" justify="center" gap="md">
        <YearSelectorSkeleton />
        <Skeleton height={36} width={200} mx="auto" />
        <MoneyChartSkeleton />
    </Stack>
);

export default Loading;

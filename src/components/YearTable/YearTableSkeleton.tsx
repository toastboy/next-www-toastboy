import { Flex, Skeleton } from '@mantine/core';

import { SkeletonTableRows } from '@/components/Skeletons/Skeletons';

/** Skeleton placeholder matching the YearTable component layout (title + subtitle + data table). */
export const YearTableSkeleton = () => (
    <Flex data-testid="skeleton-year-table" direction="column" gap="md">
        <Skeleton height={36} width={320} />
        <Skeleton height={28} width="50%" mb="xs" />
        <SkeletonTableRows rows={15} cols={2} />
    </Flex>
);

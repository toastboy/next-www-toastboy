import { Paper, Skeleton } from '@mantine/core';

import { SkeletonTableRows } from '@/components/Skeletons/Skeletons';

/** Skeleton placeholder matching a single WinnersTable component layout (table name + winners list). */
export const WinnersTableSkeleton = () => (
    <Paper data-testid="skeleton-winners-table" shadow="xl" p="lg" w="16em">
        <Skeleton height={24} width="60%" mb="md" />
        <SkeletonTableRows rows={5} cols={2} />
    </Paper>
);

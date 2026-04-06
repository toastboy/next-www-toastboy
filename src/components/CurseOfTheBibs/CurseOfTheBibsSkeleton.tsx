import { Skeleton } from '@mantine/core';

/** Skeleton placeholder matching the CurseOfTheBibs component layout (pie chart). */
export const CurseOfTheBibsSkeleton = () => (
    <Skeleton data-testid="skeleton-curse-of-the-bibs" height={300} width={300} circle mt="md" />
);

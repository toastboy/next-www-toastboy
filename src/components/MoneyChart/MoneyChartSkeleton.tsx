import { Skeleton } from '@mantine/core';

/** Skeleton placeholder matching the MoneyChart component layout (chart area). */
export const MoneyChartSkeleton = () => (
    <Skeleton data-testid="skeleton-money-chart" height={350} radius="md" />
);

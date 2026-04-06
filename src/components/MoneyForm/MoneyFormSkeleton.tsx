import { Paper, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the MoneyForm component layout (title + stacked debt-row cards). */
export const MoneyFormSkeleton = () => (
    <Stack data-testid="skeleton-money-form" gap="md">
        <Skeleton height={36} width={120} />
        {Array.from({ length: 6 }).map((_, i) => (
            <Paper key={i} withBorder p="sm">
                <Stack gap="sm">
                    <Skeleton height={48} width="60%" />
                    <Skeleton height={20} width="40%" />
                    <Skeleton height={36} width={100} style={{ alignSelf: 'flex-end' }} />
                </Stack>
            </Paper>
        ))}
    </Stack>
);

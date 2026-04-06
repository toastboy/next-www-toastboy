import { Card, Skeleton, Stack } from '@mantine/core';

import { SkeletonTableRows } from '@/components/Skeletons/Skeletons';

/** Skeleton placeholder matching the ResponsesForm component layout (title + search + response group cards). */
export const ResponsesFormSkeleton = () => (
    <Stack data-testid="skeleton-responses-form" gap="md">
        <Stack align="left" gap="xs">
            <Skeleton height={28} width={160} />
            <Skeleton height={18} width={200} />
            <Skeleton height={36} width="100%" />
        </Stack>
        {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} withBorder shadow="sm">
                <Card.Section h={6} />
                <Skeleton height={24} width="30%" mt="sm" mb="sm" />
                <SkeletonTableRows rows={3} cols={4} />
            </Card>
        ))}
    </Stack>
);

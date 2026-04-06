import { Paper, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the GameResultForm component layout (bibs/winners inputs + submit). */
export const GameResultFormSkeleton = () => (
    <Paper data-testid="skeleton-game-result-form" withBorder p="md" shadow="xs">
        <Stack gap="sm">
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width={80} style={{ alignSelf: 'flex-end' }} />
        </Stack>
    </Paper>
);

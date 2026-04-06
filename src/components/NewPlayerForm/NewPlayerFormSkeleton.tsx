import { Box, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the NewPlayerForm component layout (name + email + select + button). */
export const NewPlayerFormSkeleton = () => (
    <Box data-testid="skeleton-new-player-form" maw={400}>
        <Stack gap="md">
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width={120} mt="md" />
        </Stack>
    </Box>
);

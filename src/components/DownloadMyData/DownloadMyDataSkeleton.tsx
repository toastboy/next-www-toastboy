import { Paper, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the DownloadMyData component layout (title + button + code block). */
export const DownloadMyDataSkeleton = () => (
    <Stack data-testid="skeleton-download-my-data" gap="lg">
        <Skeleton height={36} width={240} />
        <Skeleton height={18} width="60%" />
        <Skeleton height={36} width={160} />
        <Paper withBorder p="md" radius="md">
            <Stack gap="md">
                <Skeleton height={20} width="100%" />
                <Skeleton height={20} width="80%" />
                <Skeleton height={300} radius="md" />
            </Stack>
        </Paper>
    </Stack>
);

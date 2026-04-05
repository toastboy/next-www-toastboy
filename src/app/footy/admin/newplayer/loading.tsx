import { Box, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the NewPlayerForm layout (name + email + select + button). */
const Loading = () => (
    <Box maw={400}>
        <Stack gap="md">
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width="100%" />
            <Skeleton height={36} width={120} mt="md" />
        </Stack>
    </Box>
);

export default Loading;

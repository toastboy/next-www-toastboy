import { Flex, Paper, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the GamePage layout (nav links + result form + game summary). */
const Loading = () => (
    <Flex w="100%" direction="column" gap="md">
        <Skeleton height={20} width={80} />
        <Skeleton height={20} width={60} style={{ alignSelf: 'flex-end' }} />
        <Paper withBorder p="md" shadow="xs">
            <Stack gap="sm">
                <Skeleton height={36} width="100%" />
                <Skeleton height={36} width={80} style={{ alignSelf: 'flex-end' }} />
            </Stack>
        </Paper>
        <Flex direction="column" gap="sm">
            <Skeleton height={36} width="60%" />
            <Skeleton height={24} width={80} />
            <Skeleton height={24} width={120} />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`a-${i}`} height={20} width="80%" />
            ))}
            <Skeleton height={20} width={30} mx="auto" />
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`b-${i}`} height={20} width="80%" />
            ))}
        </Flex>
    </Flex>
);

export default Loading;

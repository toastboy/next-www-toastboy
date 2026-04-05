import { Box, Container, Flex, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the PlayerProfileForm layout (text inputs + switches + selects + button). */
const Loading = () => (
    <Container size="xs" mt="xl">
        <Box maw={400}>
            <Skeleton height={36} width="100%" mb="md" />
            <Flex gap="md" align="center" mb="md">
                <Skeleton height={24} width={120} />
                <Skeleton height={24} width={120} />
            </Flex>
            <Stack gap="md">
                <Skeleton height={36} width="100%" />
                <Skeleton height={36} width="100%" />
                <Skeleton height={36} width="100%" />
                <Skeleton height={36} width="100%" />
                <Skeleton height={60} width="100%" />
            </Stack>
            <Skeleton height={36} width={100} mt="md" />
        </Box>
    </Container>
);

export default Loading;

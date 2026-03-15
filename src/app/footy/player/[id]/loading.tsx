import { Box, Container, Skeleton } from '@mantine/core';

import { SkeletonTableRows } from '@/components/Skeletons/Skeletons';

const Loading = () => (
    <Container>
        <Skeleton height={36} width="40%" mb="md" />
        <Box maw="40em" mb="md">
            <Skeleton height={400} radius="md" />
        </Box>
        <SkeletonTableRows rows={7} cols={2} />
        <Skeleton height={120} mt="md" radius="md" />
    </Container>
);

export default Loading;

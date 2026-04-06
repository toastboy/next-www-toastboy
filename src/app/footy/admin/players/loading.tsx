import { Center, Container, Skeleton, Stack } from '@mantine/core';

import { AdminPlayerListSkeleton } from '@/components/AdminPlayerList/AdminPlayerListSkeleton';

/** Skeleton placeholder matching the AdminPlayerList layout (title + filter + sortable table). */
const Loading = () => (
    <Container fluid mt="xl">
        <Center>
            <Skeleton height={28} width={200} mb="md" />
        </Center>
        <Stack mb="lg">
            <AdminPlayerListSkeleton />
        </Stack>
    </Container>
);

export default Loading;

import { Center, Container, Skeleton } from '@mantine/core';

/** Skeleton placeholder matching the AdminUserData component layout (title + JSON data block). */
export const AdminUserDataSkeleton = () => (
    <Container data-testid="skeleton-admin-user-data" size="xs" mt="xl">
        <Center>
            <Skeleton height={28} width={200} mb="md" />
        </Center>
        <Skeleton height={400} radius="md" />
    </Container>
);

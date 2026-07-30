import {
    Container,
    Skeleton,
} from '@mantine/core';

/**
 * Skeleton for the AdminUpdatePlayerRecords component:
 * circular progress ring placeholder → button placeholder.
 */
export const SkeletonRecordsProgress = () => (
    <Container role="status" aria-label="Loading player records progress">
        <Skeleton height={120} width={120} circle mx="auto" mb="md" />
        <Skeleton height={36} width={200} mx="auto" />
    </Container>
);

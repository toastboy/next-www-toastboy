import { Container, Group, Skeleton } from '@mantine/core';

import { DrinkersFormSkeleton } from '@/components/DrinkersForm/DrinkersFormSkeleton';

/** Skeleton placeholder matching the DrinkersForm layout (nav + title + search + table + save). */
const Loading = () => (
    <Container size="lg" py="lg">
        <Group justify="space-between" mb="md">
            <Skeleton height={20} width={80} />
            <Skeleton height={20} width={60} />
        </Group>
        <DrinkersFormSkeleton />
    </Container>
);

export default Loading;

import { Center, Container, Skeleton } from '@mantine/core';

/** Skeleton placeholder matching the AdminUserData layout (title + JSON code block). */
const Loading = () => (
    <Container size="xs" mt="xl">
        <Center>
            <Skeleton height={28} width={200} mb="md" />
        </Center>
        <Skeleton height={400} radius="md" />
    </Container>
);

export default Loading;

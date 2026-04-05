import { Container, Paper, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the MoneyForm layout (title + stacked debt rows). */
const Loading = () => (
    <Container size="lg" py="lg">
        <Stack gap="md">
            <Skeleton height={36} width={120} />
            {Array.from({ length: 6 }).map((_, i) => (
                <Paper key={i} withBorder p="sm">
                    <Stack gap="sm">
                        <Skeleton height={48} width="60%" />
                        <Skeleton height={20} width="40%" />
                        <Skeleton height={36} width={100} style={{ alignSelf: 'flex-end' }} />
                    </Stack>
                </Paper>
            ))}
        </Stack>
    </Container>
);

export default Loading;

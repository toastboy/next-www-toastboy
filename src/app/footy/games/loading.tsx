import { Flex, Paper, SimpleGrid, Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the GamesPage layout (YearSelector + title + GameDayList grid). */
const Loading = () => (
    <Flex direction="column" align="center" gap="lg">
        <Skeleton height={86} width="100%" />
        <Skeleton height={36} width={200} />
        <Skeleton height={28} width="40%" />
        <Stack align="stretch" justify="center" w="100%">
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Paper key={i} shadow="xl" p="xl">
                        <Skeleton height={24} width="60%" mb="sm" />
                        <SimpleGrid cols={2}>
                            {Array.from({ length: 4 }).map((_, j) => (
                                <Skeleton key={j} height={36} radius="md" />
                            ))}
                        </SimpleGrid>
                    </Paper>
                ))}
            </SimpleGrid>
        </Stack>
    </Flex>
);

export default Loading;

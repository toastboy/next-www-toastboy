import { Skeleton, Stack } from '@mantine/core';

/** Skeleton placeholder matching the BooksPage layout (YearSelector + title + MoneyChart). */
const Loading = () => (
    <Stack align="stretch" justify="center" gap="md">
        <Skeleton height={86} width="100%" />
        <Skeleton height={36} width={200} mx="auto" />
        <Skeleton height={350} radius="md" />
    </Stack>
);

export default Loading;

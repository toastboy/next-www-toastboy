import { Flex, Skeleton } from '@mantine/core';

/** Skeleton placeholder matching the CurseOfTheBibsPage layout (YearSelector + pie chart). */
const Loading = () => (
    <Flex direction="column" w="100%" align="center">
        <Skeleton height={86} width="100%" />
        <Skeleton height={300} width={300} circle mt="md" />
    </Flex>
);

export default Loading;

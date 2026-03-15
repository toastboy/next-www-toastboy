import { Flex, Skeleton } from '@mantine/core';

import { SkeletonTableRows } from '@/components/Skeletons/Skeletons';

const Loading = () => (
    <Flex direction="column" gap="md">
        <Skeleton height={36} width={320} />
        <Skeleton height={28} width="50%" mb="xs" />
        <SkeletonTableRows rows={15} cols={2} />
    </Flex>
);

export default Loading;

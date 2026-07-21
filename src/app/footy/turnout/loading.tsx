import { Stack } from '@mantine/core';

import { TurnoutSkeleton } from '@/components/Turnout/TurnoutSkeleton';

const Loading = () => (
    <Stack w="100%" p="xl" align="center">
        <TurnoutSkeleton />
    </Stack>
);

export default Loading;

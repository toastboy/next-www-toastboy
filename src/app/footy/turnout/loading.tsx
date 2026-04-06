import { Paper } from '@mantine/core';

import { TurnoutSkeleton } from '@/components/Turnout/TurnoutSkeleton';

const Loading = () => (
    <Paper shadow="xl" p="xl">
        <TurnoutSkeleton />
    </Paper>
);

export default Loading;

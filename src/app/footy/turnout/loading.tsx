import { Paper } from '@mantine/core';

import { TurnoutSkeleton } from '@/components/Turnout/TurnoutSkeleton';

const Loading = () => (
    <Paper p="xl">
        <TurnoutSkeleton />
    </Paper>
);

export default Loading;

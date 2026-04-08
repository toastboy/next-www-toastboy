import { Paper } from '@mantine/core';

import { PlayerCountryMapSkeleton } from '@/components/PlayerCountryMap/PlayerCountryMapSkeleton';

/** Loading state for the country map page. */
const Loading = () => (
    <Paper shadow="xl" p="xl">
        <PlayerCountryMapSkeleton />
    </Paper>
);

export default Loading;

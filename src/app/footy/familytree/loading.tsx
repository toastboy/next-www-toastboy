import { Paper } from '@mantine/core';

import { FamilyTreeSkeleton } from '@/components/FamilyTree/FamilyTreeSkeleton';

/** Loading state for the family tree page. */
const Loading = () => (
    <Paper shadow="xl" p="xl">
        <FamilyTreeSkeleton />
    </Paper>
);

export default Loading;

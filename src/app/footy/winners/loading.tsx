import { Grid, GridCol, Skeleton, Stack } from '@mantine/core';

import { WinnersTableSkeleton } from '@/components/WinnersTable/WinnersTableSkeleton';
import { YearSelectorSkeleton } from '@/components/YearSelector/YearSelectorSkeleton';

const Loading = () => (
    <Stack align="stretch" justify="center" gap="md">
        <YearSelectorSkeleton />
        <Skeleton height={36} width={200} mx="auto" />
        <Skeleton height={32} width="30%" mx="auto" />
        <Grid>
            {Array.from({ length: 5 }).map((_, i) => (
                <GridCol key={i} span={{ base: 12, sm: 8, md: 6, lg: 4, xl: 3 }}>
                    <WinnersTableSkeleton />
                </GridCol>
            ))}
        </Grid>
    </Stack>
);

export default Loading;

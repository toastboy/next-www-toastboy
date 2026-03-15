import { Grid, GridCol, Paper, Skeleton, Stack } from '@mantine/core';

import { SkeletonTableRows } from '@/components/Skeletons/Skeletons';

const Loading = () => (
    <Stack align="stretch" justify="center" gap="md">
        <Skeleton height={36} width={200} mx="auto" />
        <Skeleton height={32} width="30%" mx="auto" />
        <Grid>
            {Array.from({ length: 5 }).map((_, i) => (
                <GridCol key={i} span={{ base: 12, sm: 8, md: 6, lg: 4, xl: 3 }}>
                    <Paper shadow="xl" p="lg" w="16em">
                        <Skeleton height={24} width="60%" mb="md" />
                        <SkeletonTableRows rows={5} cols={2} />
                    </Paper>
                </GridCol>
            ))}
        </Grid>
    </Stack>
);

export default Loading;

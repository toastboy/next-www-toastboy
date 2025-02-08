'use client';

import { Grid, Stack, Title } from '@mantine/core';
import WinnersTable from 'components/WinnersTable/WinnersTable';
import { FootyTable } from 'lib/swr';
import { notFound } from 'next/navigation';
import { use } from 'react';

interface PageProps {
    params: Promise<{ params: string[] }>,
}

export const Page: React.FC<PageProps> = (props) => {
    const params = use(props.params);
    let year = undefined;

    if (params.params) {
        switch (params.params.length) {
            case 0:
                break;
            case 1:
                {
                    year = params.params[0] ? parseInt(params.params[0]) : 0;
                    if (isNaN(year)) {
                        return notFound();
                    }
                }
                break;
            default:
                return notFound();
        }
    }

    return (
        <Stack align="stretch" justify="center" gap="md">
            <Title w="100%" ta="center" order={1}>Winners</Title>
            <Grid>
                {
                    Object.keys(FootyTable).map((table) => {
                        return (
                            <Grid.Col span={4} key={table}><WinnersTable table={table as FootyTable} year={year} /></Grid.Col>
                        );
                    })
                }
            </Grid>
        </Stack>
    );
};

export default Page;

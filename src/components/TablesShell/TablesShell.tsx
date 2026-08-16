'use client';

import { Stack, Title } from '@mantine/core';

import { TableIndexList } from '@/components/TableIndexList/TableIndexList';

export const TablesShell = () => {
    return (
        <Stack
            p="xl"
            align="center"
        >
            <Title
                order={2}
                mb="xs"
                w="100%"
                ta="center"
            >
                The League Tables
            </Title>
            <TableIndexList />
        </Stack>
    );
};

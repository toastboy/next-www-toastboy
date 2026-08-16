'use client';

import {
    Anchor,
    Divider,
    Flex,
    Group,
    Image,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { type TableName } from 'prisma/zod/schemas';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { RecordsTable } from '@/components/RecordsTable/RecordsTable';
import { ShortTableTitle } from '@/lib/tables';
import { PlayerRecordDataType } from '@/types';
import { FootyChannel } from '@/types/FootyChannel';

export interface Props {
    year: number;
    tables: readonly TableName[];
    tableRecords: PlayerRecordDataType[][];
}

export const HomeContent = ({ year, tables, tableRecords }: Props) => {
    return (
        <Stack
            p="xl"
            align="center"
        >
            <AutoRefresh
                channels={[FootyChannel.Results, FootyChannel.Players]}
            />
            <Image
                src="/crest.jpg"
                width={283}
                height={342}
                alt="Toastboy FC Crest"
                fit="contain"
            />
            <Divider
                my="md"
                w="100%"
            />
            <Group
                justify="center"
                w="100%"
            >
                <Title order={2}>Table Leaders</Title>
            </Group>
            <Flex
                wrap="wrap"
                gap="md"
                justify="center"
            >
                {tables.map((table, i) => (
                    <Stack
                        key={table}
                        align="center"
                    >
                        <Title order={3}>{ShortTableTitle(table)}</Title>
                        <RecordsTable
                            table={table}
                            year={year}
                            records={tableRecords[i]}
                        />
                    </Stack>
                ))}
            </Flex>
            <Divider
                my="md"
                w="100%"
            />
            <Text mt="md">
                Who are we?{' '}
                <Anchor href="/footy/info">
                    Information about Toastboy FC
                </Anchor>
            </Text>
            <Text mt="md">Crest design ©2003 by Joe Bright</Text>
        </Stack>
    );
};

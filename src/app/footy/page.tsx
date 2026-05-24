import { Anchor, Divider, Flex, Group, Image, Stack, Text, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { TableNameSchema } from 'prisma/zod/schemas';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { RecordsTable } from '@/components/RecordsTable/RecordsTable';
import { ShortTableTitle } from '@/lib/tables';
import gameDayService from '@/services/GameDay';
import playerRecordService from '@/services/PlayerRecord';
import { FootyChannel } from '@/types/FootyChannel';

const HomePage = async () => {
    const tables = [
        TableNameSchema.enum.points,
        TableNameSchema.enum.averages,
        TableNameSchema.enum.stalwart,
    ] as const;
    const year = await gameDayService.getCurrentYear();
    if (!year) return notFound();

    const tableRecords = await Promise.all(
        tables.map((table) => playerRecordService.getTable(table, year, true, 3)),
    );

    return (
        <Stack w="100%" p="xl" align="center">
            <AutoRefresh channels={[FootyChannel.Results, FootyChannel.Players]} />
            <Image
                src="/crest.jpg"
                width={283}
                height={342}
                alt="Toastboy FC Crest"
                fit="contain" />
            <Divider my="md" w="100%" />
            <Group justify="center" w="100%">
                <Title order={2}>Table Leaders</Title>
            </Group>
            <Flex direction={{ base: 'column', md: 'row' }} gap="md" justify="center">
                {tables.map((table, i) => (
                    <Stack key={table} align="center" w="12rem">
                        <Title order={3}>{ShortTableTitle(table)}</Title>
                        <RecordsTable
                            table={table}
                            year={year}
                            records={tableRecords[i]}
                        />
                    </Stack>
                ))}
            </Flex>
            <Divider my="md" w="100%" />
            <Text mt="md">
                Who are we?{' '}
                <Anchor href="/footy/info">Information about Toastboy FC</Anchor>
            </Text>
            <Text mt="md">
                Crest design ©2003 by Joe Bright
            </Text>
        </Stack>
    );
};

export default HomePage;

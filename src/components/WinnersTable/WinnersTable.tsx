'use client';

import {
    Button,
    Divider,
    Paper,
    Table,
    Title,
    VisuallyHidden,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import type { TableName } from 'prisma/zod/schemas';
import { useId, useMemo } from 'react';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { groupDisplays, visibleRowCount } from '@/lib/collapsibleGroups';
import { config } from '@/lib/config';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    records: PlayerRecordDataType[];
}

export const WinnersTable = ({ table, records }: Props) => {
    const years = useMemo(
        () => groupDisplays(records, (record) => record.year),
        [records],
    );
    const cutoff = useMemo(
        () => visibleRowCount(years, config.tableVisibleRows),
        [years],
    );
    const [opened, { toggle }] = useDisclosure(false);
    const hiddenCount = records.length - cutoff;
    const visibleRecords = opened ? records : records.slice(0, cutoff);
    const tbodyId = useId();

    const rows = visibleRecords.map((winner, index) => (
        <Table.Tr
            key={winner.id}
            bd={years[index + 1]?.visible === false ? '0' : undefined}
        >
            <Table.Td>{years[index].visible ? winner.year : ''}</Table.Td>
            <Table.Td>
                <PlayerLink
                    player={winner.player}
                    year={winner.year}
                />
            </Table.Td>
        </Table.Tr>
    ));

    return records.length > 0 ? (
        <Paper
            p="sm"
            miw="14rem"
            maw="18rem"
        >
            <Title
                order={3}
                mb="xs"
                w="100%"
                ta="center"
            >
                {table.charAt(0).toUpperCase() + table.slice(1)}
            </Title>
            <Divider mb="xs" />

            <Table>
                <Table.Thead>
                    <Table.Tr bd="0">
                        <Table.Th
                            w="4em"
                            p={0}
                        >
                            <VisuallyHidden>Year</VisuallyHidden>
                        </Table.Th>
                        <Table.Th
                            w="auto"
                            p={0}
                        >
                            <VisuallyHidden>Winner(s)</VisuallyHidden>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody id={tbodyId}>{rows}</Table.Tbody>
            </Table>
            {hiddenCount > 0 && (
                <Button
                    onClick={toggle}
                    variant="subtle"
                    fullWidth
                    mt="xs"
                    aria-expanded={opened}
                    aria-controls={tbodyId}
                    rightSection={
                        opened ? (
                            <IconChevronUp size={16} />
                        ) : (
                            <IconChevronDown size={16} />
                        )
                    }
                >
                    {opened ? 'Show less' : `Show ${hiddenCount} more`}
                </Button>
            )}
        </Paper>
    ) : null;
};

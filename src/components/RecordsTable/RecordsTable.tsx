'use client';

import {
    Button,
    Divider,
    Paper,
    Table,
    Title,
    type TitleOrder,
    VisuallyHidden,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { type TableName, TableNameSchema } from 'prisma/zod/schemas';
import { useId, useMemo } from 'react';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { TableScore } from '@/components/TableScore/TableScore';
import { groupDisplays, visibleRowCount } from '@/lib/collapsibleGroups';
import { config } from '@/lib/config';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    year: number;
    records: PlayerRecordDataType[];
    title?: string;
    titleOrder?: TitleOrder;
}

const rankFieldByTable = {
    [TableNameSchema.enum.points]: 'rankPoints',
    [TableNameSchema.enum.averages]: 'rankAverages',
    [TableNameSchema.enum.stalwart]: 'rankStalwart',
    [TableNameSchema.enum.speedy]: 'rankSpeedy',
    [TableNameSchema.enum.pub]: 'rankPub',
} satisfies Record<TableName, keyof PlayerRecordDataType>;

type RankField = (typeof rankFieldByTable)[TableName];

const scoreHeadingByTable = {
    [TableNameSchema.enum.points]: 'Points',
    [TableNameSchema.enum.averages]: 'Average',
    [TableNameSchema.enum.stalwart]: 'Games Played',
    [TableNameSchema.enum.speedy]: 'Average Response Time (hh:mm:ss)',
    [TableNameSchema.enum.pub]: 'Pub Score',
} satisfies Record<TableName, string>;

interface RankDisplay {
    text: string;
    visible: boolean;
}

const rankDisplays = (
    records: PlayerRecordDataType[],
    rankField: RankField,
): RankDisplay[] => {
    const groups = groupDisplays(records, (record) => {
        const rank = record[rankField];
        // A missing rank is never tied with another missing rank.
        return rank ?? Symbol();
    });

    return records.map((record, index) => {
        const rank = record[rankField];
        const isMissing = rank === null || rank === undefined;

        return {
            text: isMissing ? '-' : `${rank}`,
            visible: groups[index].visible,
        };
    });
};

export const RecordsTable = ({
    table,
    year,
    records,
    title,
    titleOrder = 2,
}: Props) => {
    const rankField = rankFieldByTable[table];
    const scoreHeading = scoreHeadingByTable[table];
    const ranks = useMemo(
        () => rankDisplays(records, rankField),
        [records, rankField],
    );
    const cutoff = useMemo(
        () => visibleRowCount(ranks, config.tableVisibleRows),
        [ranks],
    );
    const [opened, { toggle }] = useDisclosure(false);
    const hiddenCount = records.length - cutoff;
    const visibleRecords = opened ? records : records.slice(0, cutoff);
    const tbodyId = useId();

    return (
        <Paper p="sm" miw="14rem" maw="24rem">
            {title ? (
                <>
                    <Title order={titleOrder} mb="xs" w="100%" ta="center">
                        {title}
                    </Title>
                    <Divider mb="xs" />
                </>
            ) : null}
            <Table stickyHeader stickyHeaderOffset={0}>
                <Table.Thead>
                    <Table.Tr bd="0">
                        <Table.Th p={0}>
                            <VisuallyHidden>Position</VisuallyHidden>
                        </Table.Th>
                        <Table.Th p={0}>
                            <VisuallyHidden>Player</VisuallyHidden>
                        </Table.Th>
                        <Table.Th p={0}>
                            <VisuallyHidden>{scoreHeading}</VisuallyHidden>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody id={tbodyId}>
                    {visibleRecords.map((record, index) => (
                        <Table.Tr
                            key={record.id}
                            bd={
                                ranks[index + 1]?.visible === false
                                    ? '0'
                                    : undefined
                            }
                        >
                            <Table.Td>
                                {ranks[index].visible ? (
                                    ranks[index].text
                                ) : (
                                    <VisuallyHidden>
                                        {ranks[index].text}
                                    </VisuallyHidden>
                                )}
                            </Table.Td>
                            <Table.Td>
                                <PlayerLink
                                    player={record.player}
                                    year={year}
                                />
                            </Table.Td>
                            <Table.Td>
                                <TableScore
                                    table={table}
                                    playerRecord={record}
                                />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
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
    );
};

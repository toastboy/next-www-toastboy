'use client';

import { Button, Paper, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, VisuallyHidden } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { type TableName, TableNameSchema } from 'prisma/zod/schemas';
import { useId, useMemo } from 'react';

import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { TableScore } from '@/components/TableScore/TableScore';
import { config } from '@/lib/config';
import { PlayerRecordDataType } from '@/types';

export interface Props {
    table: TableName;
    year: number;
    records: PlayerRecordDataType[];
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

const rankDisplays = (records: PlayerRecordDataType[], rankField: RankField): RankDisplay[] => {
    const displays: RankDisplay[] = [];
    let prevRank: number | null | undefined;

    for (const record of records) {
        const rank = record[rankField];
        const isMissing = rank === null || rank === undefined;

        displays.push({
            text: isMissing ? '-' : `${rank}`,
            visible: isMissing || rank !== prevRank,
        });

        prevRank = rank;
    }

    return displays;
};

// Extends the initial page of rows forward past any tie straddling the cutoff,
// so a group of equally-ranked players is never split across the toggle.
const visibleRowCount = (ranks: RankDisplay[], initial: number): number => {
    let count = Math.min(initial, ranks.length);

    while (count < ranks.length && !ranks[count].visible) {
        count++;
    }

    return count;
};

export const RecordsTable = ({ table, year, records }: Props) => {
    const rankField = rankFieldByTable[table];
    const scoreHeading = scoreHeadingByTable[table];
    const ranks = useMemo(() => rankDisplays(records, rankField), [records, rankField]);
    const cutoff = useMemo(
        () => visibleRowCount(ranks, config.recordsTableVisibleRows),
        [ranks],
    );
    const [opened, { toggle }] = useDisclosure(false);
    const hiddenCount = records.length - cutoff;
    const visibleRecords = opened ? records : records.slice(0, cutoff);
    const tbodyId = useId();

    return (
        <Paper p="sm" miw="14rem" maw="24rem" withBorder>
            <Table stickyHeader stickyHeaderOffset={0}>
                <TableThead>
                    <TableTr>
                        <TableTh>Position</TableTh>
                        <TableTh>Player</TableTh>
                        <TableTh>{scoreHeading}</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody id={tbodyId}>
                    {visibleRecords.map((record, index) => (
                        <TableTr
                            key={record.id}
                            bd={ranks[index + 1]?.visible === false ? '0' : undefined}
                        >
                            <TableTd>
                                {ranks[index].visible ?
                                    ranks[index].text :
                                    <VisuallyHidden>{ranks[index].text}</VisuallyHidden>}
                            </TableTd>
                            <TableTd>
                                <PlayerLink player={record.player} year={year} />
                            </TableTd>
                            <TableTd>
                                <TableScore table={table} playerRecord={record} />
                            </TableTd>
                        </TableTr>
                    ))}
                </TableTbody>
            </Table>
            {hiddenCount > 0 &&
                <Button
                    onClick={toggle}
                    variant="subtle"
                    fullWidth
                    mt="xs"
                    aria-expanded={opened}
                    aria-controls={tbodyId}
                    rightSection={opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                >
                    {opened ? 'Show less' : `Show ${hiddenCount} more`}
                </Button>
            }
        </Paper>
    );
};

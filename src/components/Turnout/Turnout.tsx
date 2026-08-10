'use client';

import { Button, Paper, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useId } from 'react';

import { config } from '@/lib/config';
import { TurnoutByYearType } from '@/types';

import styles from './Turnout.module.css';

export interface Props {
    turnout: TurnoutByYearType[];
}

export const Turnout = ({ turnout }: Props) => {
    const sortedTurnout = [...turnout].sort((a, b) => b.year - a.year);
    const [opened, { toggle }] = useDisclosure(false);
    const hiddenCount = Math.max(
        0,
        sortedTurnout.length - config.tableVisibleRows,
    );
    const visibleTurnout = opened
        ? sortedTurnout
        : sortedTurnout.slice(0, config.tableVisibleRows);
    const tbodyId = useId();

    const rows = visibleTurnout.map((t) => (
        <Table.Tr key={t.year}>
            <Table.Td>{t.year}</Table.Td>
            <Table.Td>{t.gamesPlayed}</Table.Td>
            <Table.Td>{t.gamesCancelled}</Table.Td>
            <Table.Td>{t.responsesPerGameInitiated.toFixed(1)}</Table.Td>
            <Table.Td>{t.yessesPerGameInitiated.toFixed(1)}</Table.Td>
            <Table.Td>{t.playersPerGamePlayed.toFixed(1)}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Paper
            p="sm"
            maw="24rem"
        >
            <Table
                stickyHeader
                stickyHeaderOffset={0}
                layout="fixed"
            >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th className={styles.verticalHeader}>
                            <span className={styles.verticalHeaderText}>
                                Year
                            </span>
                        </Table.Th>
                        <Table.Th className={styles.verticalHeader}>
                            <span className={styles.verticalHeaderText}>
                                Played
                            </span>
                        </Table.Th>
                        <Table.Th className={styles.verticalHeader}>
                            <span className={styles.verticalHeaderText}>
                                Cancelled
                            </span>
                        </Table.Th>
                        <Table.Th className={styles.verticalHeader}>
                            <span className={styles.verticalHeaderText}>
                                Response Rate
                            </span>
                        </Table.Th>
                        <Table.Th className={styles.verticalHeader}>
                            <span className={styles.verticalHeaderText}>
                                Yes Rate
                            </span>
                        </Table.Th>
                        <Table.Th className={styles.verticalHeader}>
                            <span className={styles.verticalHeaderText}>
                                Turnout Rate
                            </span>
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
    );
};

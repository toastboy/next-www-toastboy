'use client';

import {
    Button,
    Paper,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useId } from 'react';

import { config } from '@/lib/config';
import { TurnoutByYearType } from '@/types';

import styles from './Turnout.module.css';

export interface Props {
    turnout: TurnoutByYearType[],
}

export const Turnout = ({ turnout }: Props) => {
    const sortedTurnout = [...turnout].sort((a, b) => b.year - a.year);
    const [opened, { toggle }] = useDisclosure(false);
    const hiddenCount = Math.max(0, sortedTurnout.length - config.tableVisibleRows);
    const visibleTurnout = opened ?
        sortedTurnout :
        sortedTurnout.slice(0, config.tableVisibleRows);
    const tbodyId = useId();

    const rows = visibleTurnout.map((t) => (
        <TableTr key={t.year}>
            <TableTd>{t.year}</TableTd>
            <TableTd>{t.gamesPlayed}</TableTd>
            <TableTd>{t.gamesCancelled}</TableTd>
            <TableTd>{t.responsesPerGameInitiated.toFixed(1)}</TableTd>
            <TableTd>{t.yessesPerGameInitiated.toFixed(1)}</TableTd>
            <TableTd>{t.playersPerGamePlayed.toFixed(1)}</TableTd>
        </TableTr>
    ));

    return (
        <Paper p="sm" maw="24rem" withBorder>
            <Table stickyHeader stickyHeaderOffset={0} layout="fixed">
                <TableThead>
                    <TableTr>
                        <TableTh className={styles.verticalHeader}><span className={styles.verticalHeaderText}>Year</span></TableTh>
                        <TableTh className={styles.verticalHeader}><span className={styles.verticalHeaderText}>Played</span></TableTh>
                        <TableTh className={styles.verticalHeader}><span className={styles.verticalHeaderText}>Cancelled</span></TableTh>
                        <TableTh className={styles.verticalHeader}><span className={styles.verticalHeaderText}>Response Rate</span></TableTh>
                        <TableTh className={styles.verticalHeader}><span className={styles.verticalHeaderText}>Yes Rate</span></TableTh>
                        <TableTh className={styles.verticalHeader}><span className={styles.verticalHeaderText}>Turnout Rate</span></TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody id={tbodyId}>{rows}</TableTbody>
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

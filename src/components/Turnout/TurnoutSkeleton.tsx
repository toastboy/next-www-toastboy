import { Paper, Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

import { config } from '@/lib/config';

/** Skeleton placeholder matching the Turnout component layout (year-based turnout data table in a Paper card). */
export const TurnoutSkeleton = () => (
    <Paper p="sm" withBorder data-testid="skeleton-turnout">
        <Table layout="fixed">
            <TableThead>
                <TableTr>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <TableTh key={i}>
                            <Skeleton height={14} width={60} />
                        </TableTh>
                    ))}
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: config.turnoutTableVisibleRows }).map((_, i) => (
                    <TableTr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                            <TableTd key={j}>
                                <Skeleton height={14} />
                            </TableTd>
                        ))}
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </Paper>
);

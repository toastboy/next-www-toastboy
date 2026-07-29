import {
    Paper,
    Skeleton,
    Table,
} from '@mantine/core';

import { config } from '@/lib/config';

/** Skeleton placeholder matching the Turnout component layout (year-based turnout data table in a Paper card). */
export const TurnoutSkeleton = () => (
    <Paper p="sm" withBorder data-testid="skeleton-turnout">
        <Table layout="fixed">
            <Table.Thead>
                <Table.Tr>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Table.Th key={i}>
                            <Skeleton height={14} width={60} />
                        </Table.Th>
                    ))}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: config.tableVisibleRows }).map((_, i) => (
                    <Table.Tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                            <Table.Td key={j}>
                                <Skeleton height={14} />
                            </Table.Td>
                        ))}
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Paper>
);

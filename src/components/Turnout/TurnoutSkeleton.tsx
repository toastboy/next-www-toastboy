import { Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the Turnout component layout (year-based turnout data table). */
export const TurnoutSkeleton = () => (
    <Table data-testid="skeleton-turnout">
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
            {Array.from({ length: 20 }).map((_, i) => (
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
);

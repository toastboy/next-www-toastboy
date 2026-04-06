import { Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the AdminPlayerList component layout (filter + sortable player table). */
export const AdminPlayerListSkeleton = () => (
    <>
        <Skeleton height={20} width={120} />
        <Skeleton height={36} width="100%" />
        <Table data-testid="skeleton-admin-player-list" striped highlightOnHover withTableBorder withColumnBorders>
            <TableThead>
                <TableTr>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <TableTh key={i}><Skeleton height={14} width={60} /></TableTh>
                    ))}
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 15 }).map((_, i) => (
                    <TableTr key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                            <TableTd key={j}><Skeleton height={14} /></TableTd>
                        ))}
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </>
);

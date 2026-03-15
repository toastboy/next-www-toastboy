import { Container, Skeleton, Table, TableTbody, TableTd, TableTr } from '@mantine/core';

/**
 * Generic skeleton for a data table body — rows x cols cells, each with a
 * shimmering placeholder bar. Compose into page-level skeletons.
 */
export const SkeletonTableRows = ({ rows = 10, cols = 2 }: { rows?: number; cols?: number }) => (
    <Table>
        <TableTbody>
            {Array.from({ length: rows }).map((_, i) => (
                <TableTr key={`row-${i}`}>
                    {Array.from({ length: cols }).map((_, j) => (
                        <TableTd key={`cell-${i}-${j}`}>
                            <Skeleton height={14} />
                        </TableTd>
                    ))}
                </TableTr>
            ))}
        </TableTbody>
    </Table>
);

/**
 * Skeleton for the AdminUpdatePlayerRecords component:
 * circular progress ring placeholder → button placeholder.
 */
export const SkeletonRecordsProgress = () => (
    <Container data-testid="skeleton-records-progress">
        <Skeleton height={120} width={120} circle mx="auto" mb="md" />
        <Skeleton height={36} width={200} mx="auto" />
    </Container>
);

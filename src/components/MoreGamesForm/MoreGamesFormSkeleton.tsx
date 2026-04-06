import { Paper, Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the MoreGamesForm component layout (cost input + game table). */
export const MoreGamesFormSkeleton = () => (
    <Stack data-testid="skeleton-more-games-form">
        <Paper withBorder p="sm" mb="md">
            <Skeleton height={36} width="100%" />
        </Paper>
        <Table highlightOnHover withTableBorder>
            <TableThead>
                <TableTr>
                    <TableTh><Skeleton height={14} width={60} /></TableTh>
                    <TableTh><Skeleton height={14} width={40} /></TableTh>
                    <TableTh><Skeleton height={14} width={40} /></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 20 }).map((_, i) => (
                    <TableTr key={i}>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </Stack>
);

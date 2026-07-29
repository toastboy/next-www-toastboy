import { Paper, Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the MoreGamesForm component layout (title + cost input + game table). */
export const MoreGamesFormSkeleton = () => (
    <Stack gap="md">
        <Stack align="flex-start" gap="xs">
            <Skeleton height={28} width={160} />
            <Skeleton height={18} width={320} />
        </Stack>
        <Paper withBorder p="sm">
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

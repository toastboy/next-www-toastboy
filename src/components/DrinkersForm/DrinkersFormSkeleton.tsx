import { Group, Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the DrinkersForm component layout (title + search/save + drinkers table). */
export const DrinkersFormSkeleton = () => (
    <Stack gap="md">
        <Stack gap={4}>
            <Skeleton height={28} width={160} />
            <Skeleton height={18} width={200} />
            <Skeleton height={18} width={120} />
        </Stack>
        <Group justify="space-between" align="flex-end" wrap="wrap">
            <Skeleton height={36} width={200} />
            <Skeleton height={30} width={110} />
        </Group>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <TableThead>
                <TableTr>
                    <TableTh><Skeleton height={14} width={20} /></TableTh>
                    <TableTh><Skeleton height={14} width={100} /></TableTh>
                    <TableTh><Skeleton height={14} width={60} /></TableTh>
                    <TableTh><Skeleton height={14} width={80} /></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <TableTr key={i}>
                        <TableTd><Skeleton height={14} width={20} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} width={40} /></TableTd>
                        <TableTd><Skeleton height={14} width={60} /></TableTd>
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
    </Stack>
);

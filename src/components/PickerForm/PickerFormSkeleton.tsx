import { Skeleton, Stack, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from '@mantine/core';

/** Skeleton placeholder matching the PickerForm component layout (title + date + picker table + buttons). */
export const PickerFormSkeleton = () => (
    <Stack data-testid="skeleton-picker-form" gap="md">
        <Stack align="left" gap="xs">
            <Skeleton height={28} width={120} />
            <Skeleton height={18} width={200} />
        </Stack>
        <Skeleton height={20} width={180} />
        <Table striped highlightOnHover withTableBorder>
            <TableThead>
                <TableTr>
                    <TableTh><Skeleton height={14} width={20} /></TableTh>
                    <TableTh><Skeleton height={14} width={100} /></TableTh>
                    <TableTh><Skeleton height={14} width={100} /></TableTh>
                    <TableTh><Skeleton height={14} width={80} /></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {Array.from({ length: 12 }).map((_, i) => (
                    <TableTr key={i}>
                        <TableTd><Skeleton height={14} width={20} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                        <TableTd><Skeleton height={14} /></TableTd>
                    </TableTr>
                ))}
            </TableTbody>
        </Table>
        <Skeleton height={36} width="100%" />
        <Skeleton height={36} width={160} />
    </Stack>
);

import {
    Skeleton,
    Stack,
    Table,
} from '@mantine/core';

/** Skeleton placeholder matching the PickerForm component layout (title + date + picker table + buttons). */
export const PickerFormSkeleton = () => (
    <Stack gap="md">
        <Stack align="flex-start" gap="xs">
            <Skeleton height={28} width={120} />
            <Skeleton height={18} width={200} />
        </Stack>
        <Skeleton height={20} width={180} />
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th><Skeleton height={14} width={20} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={100} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={100} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={80} /></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: 12 }).map((_, i) => (
                    <Table.Tr key={i}>
                        <Table.Td><Skeleton height={14} width={20} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
        <Skeleton height={36} width="100%" />
        <Skeleton height={36} width={160} />
    </Stack>
);

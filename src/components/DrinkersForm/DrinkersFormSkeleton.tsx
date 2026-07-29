import {
    Group,
    Skeleton,
    Stack,
    Table,
} from '@mantine/core';

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
            <Table.Thead>
                <Table.Tr>
                    <Table.Th><Skeleton height={14} width={20} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={100} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={60} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={80} /></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Table.Tr key={i}>
                        <Table.Td><Skeleton height={14} width={20} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} width={40} /></Table.Td>
                        <Table.Td><Skeleton height={14} width={60} /></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Stack>
);

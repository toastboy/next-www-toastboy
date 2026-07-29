import {
    Paper,
    Skeleton,
    Stack,
    Table,
} from '@mantine/core';

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
            <Table.Thead>
                <Table.Tr>
                    <Table.Th><Skeleton height={14} width={60} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={40} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={40} /></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: 20 }).map((_, i) => (
                    <Table.Tr key={i}>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Stack>
);

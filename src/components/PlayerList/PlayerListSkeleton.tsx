import {
    Box,
    Skeleton,
    Table,
} from '@mantine/core';

/** Skeleton placeholder matching the PlayerList component layout (title + filters + player table). */
export const PlayerListSkeleton = () => (
    <Box>
        <Skeleton height={36} width={160} mb="sm" />
        <Skeleton height={20} width={250} mb="sm" />
        <Skeleton height={36} width="100%" mb="sm" />
        <Skeleton height={24} width={120} mb="sm" />
        <Skeleton height={36} width="100%" mb="md" />
        <Table mt={20}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th><Skeleton height={14} width={30} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={100} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={80} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={100} /></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: 15 }).map((_, i) => (
                    <Table.Tr key={i}>
                        <Table.Td><Skeleton height={14} width={20} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Box>
);

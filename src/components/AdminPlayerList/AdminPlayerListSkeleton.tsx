import {
    Skeleton,
    Table,
} from '@mantine/core';

/** Skeleton placeholder matching the AdminPlayerList component layout (filter + sortable player table). */
export const AdminPlayerListSkeleton = () => (
    <>
        <Skeleton height={20} width={120} />
        <Skeleton height={36} width="100%" />
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Table.Th key={i}><Skeleton height={14} width={60} /></Table.Th>
                    ))}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: 15 }).map((_, i) => (
                    <Table.Tr key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                            <Table.Td key={j}><Skeleton height={14} /></Table.Td>
                        ))}
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </>
);

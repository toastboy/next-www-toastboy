import {
    Container,
    Skeleton,
    Table,
} from '@mantine/core';

/** Skeleton placeholder matching the AdminUserList component layout (search input + user table). */
export const AdminUserListSkeleton = () => (
    <Container>
        <Skeleton height={36} width="100%" mb="md" />
        <Table mt={20}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th><Skeleton height={14} width={80} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={120} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={50} /></Table.Th>
                    <Table.Th><Skeleton height={14} width={80} /></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Table.Tr key={i}>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                        <Table.Td><Skeleton height={14} width={40} /></Table.Td>
                        <Table.Td><Skeleton height={14} /></Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    </Container>
);

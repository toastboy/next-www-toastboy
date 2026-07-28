'use client';

import {
    Anchor,
    Container,
    Divider,
    Flex,
    Paper,
    Stack,
    Switch,
    Table,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { useState } from 'react';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import type { UserWithRolePayload } from '@/lib/core/auth';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { SetAdminRoleProxy } from '@/types/actions/SetAdminRole';

export interface Props {
    users: UserWithRolePayload[];
    setAdminRole: SetAdminRoleProxy;
}

export const AdminUserList = ({ users, setAdminRole }: Props) => {
    const [sortBy, setSortBy] = useState<keyof UserWithRole | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSort = (key: keyof UserWithRole) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const toggleAdmin = async (userId: string, isAdmin: boolean) => {
        try {
            await setAdminRole(userId, isAdmin);
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                action: 'setAdminRoleAction',
                component: 'AdminUsersPage',
                route: '/footy/admin/users',
                extra: {
                    userId,
                    isAdmin,
                },
            });
            setErrorMessage('Failed to update admin status');
        }
    };

    const filteredUsers = users?.filter((user) => {
        const searchTerm = filter.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }) ?? [];

    /* v8 ignore next -- filteredUsers is always an array via the nullish coalescing above; this fallback is a defensive backstop */
    const sortedUsers = filteredUsers ? [...filteredUsers].sort((a, b) => {
        if (!sortBy) return 0;

        const aValue = String(a[sortBy] ?? '').toLowerCase();
        const bValue = String(b[sortBy] ?? '').toLowerCase();

        return sortOrder === 'asc' ?
            aValue.localeCompare(bValue) :
            bValue.localeCompare(aValue);
    }) : [];

    if (errorMessage) {
        return (
            <Container>
                <Text c="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <Container size="md" mt="xl">
            <Paper w="100%" p="xl">
                <Stack>
                    <Title order={2} mb="xs" w="100%" ta="center">
                        Auth Users
                    </Title>
                    {/* TODO: Do I want these dividers? They look a bit weird in the middle of a form, but they do help separate the title from the form. */}
                    <Divider mb="xs" />
                </Stack>

                <TextInput
                    label="Search users"
                    placeholder="Search users"
                    value={filter}
                    onChange={(event) => setFilter(event.currentTarget.value)}
                />
                <Table mt={20}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                                <Flex align="center" gap="xs">
                                    Name
                                    {sortBy === 'name' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                                </Flex>
                            </Table.Th>
                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                <Flex align="center" gap="xs">
                                    Email
                                    {sortBy === 'email' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                                </Flex>
                            </Table.Th>
                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>
                                <Flex align="center" gap="xs">
                                    Admin
                                    {sortBy === 'role' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                                </Flex>
                            </Table.Th>
                            <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                                <Flex align="center" gap="xs">
                                    Created
                                    {sortBy === 'createdAt' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                                </Flex>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sortedUsers.map((user) => (
                            <Table.Tr key={user.email}>
                                <Table.Td>
                                    <Anchor href={`/footy/admin/user/${encodeURIComponent(user.email)}`}>
                                        {user.name}
                                    </Anchor>
                                </Table.Td>
                                <Table.Td>
                                    <Anchor href={`/footy/admin/user/${encodeURIComponent(user.email)}`}>
                                        {user.email}
                                    </Anchor>
                                </Table.Td>
                                <Table.Td>
                                    <Switch
                                        checked={user.role === 'admin'}
                                        onChange={(event) => toggleAdmin(user.id, event.currentTarget.checked)}
                                        aria-label={
                                            user.name ?
                                                `Toggle admin status for ${user.name}` :
                                                `Toggle admin status for ${user.email}`
                                        }
                                        color="blue"
                                    />
                                </Table.Td>
                                <Table.Td>
                                    <RelativeTime date={user.createdAt} />
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </Container>
    );
};

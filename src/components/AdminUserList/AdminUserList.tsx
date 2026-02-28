'use client';

import { Anchor, Container, Flex, Switch, Table, Text, TextInput } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { useState } from 'react';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import { UserWithRolePayload } from '@/lib/actions/auth/auth';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { SetAdminRoleProxy } from '@/types/actions/SetAdminRole';

export interface Props {
    users: UserWithRolePayload[];
    setAdminRole: SetAdminRoleProxy;
}

export const AdminUserList: React.FC<Props> = ({ users, setAdminRole }) => {
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

    const sortedUsers = filteredUsers ? [...filteredUsers].sort((a, b) => {
        if (!sortBy) return 0;

        const aValue = a[sortBy]?.toString().toLowerCase() ?? '';
        const bValue = b[sortBy]?.toString().toLowerCase() ?? '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' ?
                aValue.localeCompare(bValue) :
                bValue.localeCompare(aValue);
        }

        return 0;
    }) : [];

    if (errorMessage) {
        return (
            <Container>
                <Text c="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <Container>
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
        </Container>
    );
};

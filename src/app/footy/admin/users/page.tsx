'use client';

import { Anchor, Container, Flex, Switch, Table, Text, TextInput } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { UserWithRole } from 'better-auth/plugins/admin';
import { useEffect, useState } from 'react';

import { listUsersAction, setAdminRoleAction } from '@/actions/auth';
import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import { captureUnexpectedError } from '@/lib/observability/sentry';

export default function Page() {
    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<keyof UserWithRole | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await listUsersAction();
                setUsers(response.map((user) => ({
                    ...user,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt),
                    banExpires: user.banExpires ? new Date(user.banExpires) : null,
                })));
            } catch (error) {
                captureUnexpectedError(error, {
                    layer: 'client',
                    action: 'listUsersAction',
                    component: 'AdminUsersPage',
                    route: '/footy/admin/users',
                });
                setErrorMessage('An error occurred while fetching users');
            }
        };

        // Errors are handled inside fetchUsers
        void fetchUsers();
    }, []);

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
            // Optimistically update state
            setUsers((prevUsers) =>
                prevUsers?.map((user) =>
                    user.id === userId ? { ...user, role: isAdmin ? 'admin' : 'user' } : user,
                ) ?? [],
            );

            // Call API to update user role
            await setAdminRoleAction(userId, isAdmin);
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

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc' ?
                aValue.localeCompare(bValue) :
                bValue.localeCompare(aValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc' ?
                aValue.getTime() - bValue.getTime() :
                bValue.getTime() - aValue.getTime();
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
}

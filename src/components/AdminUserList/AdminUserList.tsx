'use client';

import {
    Anchor,
    Container,
    Group,
    Paper,
    Switch,
    Table,
    Text,
    TextInput,
    UnstyledButton,
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

    const renderSortHeader = (label: string, key: keyof UserWithRole) => (
        <UnstyledButton type="button" onClick={() => handleSort(key)} aria-label={`Sort by ${label}`}>
            <Group gap={6} wrap="nowrap">
                <Text span>{label}</Text>
                {sortBy === key ? (
                    sortOrder === 'asc' ?
                        <IconSortAscending size={16} aria-hidden="true" focusable={false} /> :
                        <IconSortDescending size={16} aria-hidden="true" focusable={false} />
                ) : null}
            </Group>
        </UnstyledButton>
    );

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
        <Container size="md">
            <Paper w="100%" p="xl">
                <TextInput
                    label="Search users"
                    placeholder="Search users"
                    value={filter}
                    onChange={(event) => setFilter(event.currentTarget.value)}
                />
                <Table.ScrollContainer minWidth="100%" scrollAreaProps={{ type: 'auto' }}>
                    <Table mt={20} layout="fixed">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th w="10rem" aria-sort={sortBy === 'name' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Name', 'name')}
                                </Table.Th>
                                <Table.Th w="16rem" aria-sort={sortBy === 'email' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Email', 'email')}
                                </Table.Th>
                                <Table.Th w="6rem" aria-sort={sortBy === 'role' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Admin', 'role')}
                                </Table.Th>
                                <Table.Th w="10rem" aria-sort={sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Created', 'createdAt')}
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
                </Table.ScrollContainer>
            </Paper>
        </Container>
    );
};

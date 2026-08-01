'use client';

import {
    Anchor,
    Center,
    Container,
    Group,
    Paper,
    Switch,
    Table,
    TableScrollContainer,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    TextInput,
    Title,
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
        <Container size="md" mt="xl">
            <Paper w="100%">
                <Center>
                    <Title order={2} mb="md">
                        Admin: Users
                    </Title>
                </Center>
                <TextInput
                    label="Search users"
                    placeholder="Search users"
                    value={filter}
                    onChange={(event) => setFilter(event.currentTarget.value)}
                />
                <TableScrollContainer minWidth="100%" scrollAreaProps={{ type: 'auto' }}>
                    <Table mt={20} layout="fixed">
                        <TableThead>
                            <TableTr>
                                <TableTh w="10rem" aria-sort={sortBy === 'name' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Name', 'name')}
                                </TableTh>
                                <TableTh w="16rem" aria-sort={sortBy === 'email' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Email', 'email')}
                                </TableTh>
                                <TableTh w="6rem" aria-sort={sortBy === 'role' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Admin', 'role')}
                                </TableTh>
                                <TableTh w="10rem" aria-sort={sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                    {renderSortHeader('Created', 'createdAt')}
                                </TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>
                            {sortedUsers.map((user) => (
                                <TableTr key={user.email}>
                                    <TableTd>
                                        <Anchor href={`/footy/admin/user/${encodeURIComponent(user.email)}`}>
                                            {user.name}
                                        </Anchor>
                                    </TableTd>
                                    <TableTd>
                                        <Anchor href={`/footy/admin/user/${encodeURIComponent(user.email)}`}>
                                            {user.email}
                                        </Anchor>
                                    </TableTd>
                                    <TableTd>
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
                                    </TableTd>
                                    <TableTd>
                                        <RelativeTime date={user.createdAt} />
                                    </TableTd>
                                </TableTr>
                            ))}
                        </TableTbody>
                    </Table>
                </TableScrollContainer>
            </Paper>
        </Container>
    );
};

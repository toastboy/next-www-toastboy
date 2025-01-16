'use client';

import { Container, Loader, Table, Text } from '@mantine/core';
import { UserWithRole } from 'better-auth/plugins/admin';
import { useEffect, useState } from 'react';
import { authClient } from 'src/lib/auth-client';

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserWithRole[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<keyof UserWithRole | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authClient.admin.listUsers({
                    query: {
                        limit: 10,
                    },
                });

                if ('data' in response && response.data) {
                    setUsers(response.data?.users || []);
                } else {
                    setErrorMessage(response.error.message || 'An error occurred while fetching users');
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSort = (key: keyof UserWithRole) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const sortedUsers = users ? [...users].sort((a, b) => {
        if (!sortBy) return 0;

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
            return sortOrder === 'asc'
                ? aValue.getTime() - bValue.getTime()
                : bValue.getTime() - aValue.getTime();
        }

        return 0;
    }) : [];

    if (loading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (errorMessage) {
        return (
            <Container>
                <Text color="red">{errorMessage}</Text>
            </Container>
        );
    }

    return (
        <Container>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                            Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                            Email {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>
                            Role {sortBy === 'role' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                            Created At {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {sortedUsers.map((user) => (
                        <Table.Tr key={user.email}>
                            <Table.Td>{user.name}</Table.Td>
                            <Table.Td>{user.email}</Table.Td>
                            <Table.Td>{user.role}</Table.Td>
                            <Table.Td>{user.createdAt.toISOString()}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
}

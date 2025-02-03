'use client';

import { Anchor, Container, Flex, Loader, Switch, Table, Text, TextInput, Title } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import GameDayLink from 'components/GameDayLink';
import { RelativeTime } from 'components/RelativeTime';
import { FootyPlayerData, usePlayers } from 'lib/swr';
import { useState } from 'react';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    const { data: players, error, isLoading } = usePlayers();
    const [sortBy, setSortBy] = useState<keyof FootyPlayerData | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [active, setActive] = useState(true);

    const handleSort = (key: keyof FootyPlayerData) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const filteredPlayers = players?.filter((player) => {
        const searchTerm = filter.toLowerCase();
        const searchResult = (player.name?.toLowerCase().includes(searchTerm) ||
            player.email?.toLowerCase().includes(searchTerm));

        return searchResult && (!active || player.finished === null);
    }) || [];

    const sortedPlayers = filteredPlayers ? [...filteredPlayers].sort((a, b) => {
        if (!sortBy) return 0;

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'number' || typeof bValue === 'number') {
            const naValue = aValue as number || 0;
            const nbValue = bValue as number || 0;

            return sortOrder === 'asc' ? naValue - nbValue : nbValue - naValue;
        }

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

    if (isLoading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Text c="red">{error}</Text>
            </Container>
        );
    }

    return (
        <Container>
            <Title order={1}>{sortedPlayers.length} Active{active ? " " : " and Former "}Players</Title>
            <TextInput
                mt={20}
                mb={20}
                placeholder="Search players"
                value={filter}
                onChange={(event) => setFilter(event.currentTarget.value)}
            />
            <Switch
                mt={20}
                mb={20}
                checked={active}
                onChange={(event) => setActive(event.currentTarget.checked)}
                color="blue"
                label="Active"
            />
            <Table mt={20}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                            <Flex align="center" gap="xs">
                                ID
                                {sortBy === 'id' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                            </Flex>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('login')}>
                            <Flex align="center" gap="xs">
                                Login
                                {sortBy === 'login' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                            </Flex>
                        </Table.Th>
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
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('lastPlayed')}>
                            <Flex align="center" gap="xs">
                                Last Played
                                {sortBy === 'lastPlayed' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                            </Flex>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('joined')}>
                            <Flex align="center" gap="xs">
                                Joined
                                {sortBy === 'joined' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                            </Flex>
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('finished')}>
                            <Flex align="center" gap="xs">
                                Finished
                                {sortBy === 'finished' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                            </Flex>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {sortedPlayers.map((player) => (
                        <Table.Tr key={player.id}>
                            <Table.Td>
                                <Anchor href={`/footy/player/${encodeURIComponent(player.id || "")}`}>
                                    {player.id}
                                </Anchor>
                            </Table.Td>
                            <Table.Td>
                                <Anchor href={`/footy/player/${encodeURIComponent(player.login || "")}`}>
                                    {player.login}
                                </Anchor>
                            </Table.Td>
                            <Table.Td>
                                <Anchor href={`/footy/player/${encodeURIComponent(player.id || "")}`}>
                                    {player.name}
                                </Anchor>
                            </Table.Td>
                            <Table.Td>
                                <Anchor href={`/footy/player/${encodeURIComponent(player.id || "")}`}>
                                    {player.email?.split(',').map((email, index) => (
                                        <div key={index}>{email}</div>
                                    ))}
                                </Anchor>
                            </Table.Td>
                            <Table.Td>
                                {player.lastPlayed &&
                                    <GameDayLink id={player.lastPlayed} />
                                }
                            </Table.Td>
                            <Table.Td>
                                {player.joined &&
                                    <RelativeTime date={player.joined} />
                                }
                            </Table.Td>
                            <Table.Td>
                                {player.finished &&
                                    <RelativeTime date={player.finished} />
                                }
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
};

export default Page;

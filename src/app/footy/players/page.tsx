'use client';

import { Anchor, Container, Flex, Loader, Slider, Switch, Table, Text, TextInput, Title } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import PlayerTimeline from 'components/PlayerTimeline/PlayerTimeline';
import { FootyPlayerData, useCurrentGame, usePlayers } from 'lib/swr';
import { useState } from 'react';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    const { data: players, error: playersError, isLoading: playersLoading } = usePlayers();
    const { data: currentGame, error: currentGameError, isLoading: currentGameLoading } = useCurrentGame();
    const [sortBy, setSortBy] = useState<keyof FootyPlayerData | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [active, setActive] = useState(true);
    const [replySince, setReplySince] = useState(0);

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

    const playersRepliedSince = filteredPlayers.filter((player) => {
        return player.lastResponded && (player.lastResponded >= (currentGame?.id || 0) - replySince);
    });

    const sortedPlayers = playersRepliedSince ? [...playersRepliedSince].sort((a, b) => {
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

    if (playersLoading || currentGameLoading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (playersError) {
        // TODO: This isn't an error message
        return (
            <Container>
                <Text c="red">{playersError}</Text>
            </Container>
        );
    }

    if (currentGameError) {
        // TODO: This isn't an error message
        return (
            <Container>
                <Text c="red">{currentGameError}</Text>
            </Container>
        );
    }

    return (
        <Container>
            <Title order={1}>{sortedPlayers.length} Active{active ? " " : " and Former "}Players</Title>
            <Title order={3}>who replied within {replySince} weeks</Title>
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
            <Slider
                label={(value) => `${value} weeks`}
                min={0}
                max={currentGame?.id || 0}
                step={1}
                value={replySince}
                onChange={(event) => setReplySince(event)}
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
                        <Table.Th>
                            Timeline
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {sortedPlayers.map((player) => (
                        <Table.Tr key={player.id}>
                            <Table.Td>
                                <Anchor href={`/footy/player/${encodeURIComponent(player.id || "")}`}>
                                    {player.name}
                                </Anchor>
                            </Table.Td>
                            <Table.Td>
                                <PlayerTimeline player={player} />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
};

export default Page;

'use client';

import { Alert, Anchor, Checkbox, Container, Flex, Loader, RangeSlider, Switch, Table, Text, TextInput, Title } from '@mantine/core';
import { IconAlertTriangle, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import PlayerTimeline from 'components/PlayerTimeline/PlayerTimeline';
import PlayerWDLChart from 'components/PlayerWDLChart/PlayerWDLChart';
import { useCurrentGame, usePlayers } from 'lib/swr';
import { PlayerData } from 'lib/types';
import { useEffect, useState } from 'react';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    const { data: players, error: playersError, isLoading: playersLoading } = usePlayers();
    const { data: currentGame, error: currentGameError, isLoading: currentGameLoading } = useCurrentGame();
    const [sortBy, setSortBy] = useState<keyof PlayerData | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [active, setActive] = useState(true);
    const [replyRange, setReplyRange] = useState<[number, number]>([0, 0]);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

    useEffect(() => {
        if (currentGame) {
            setReplyRange([0, currentGame.id]);
        }
    }, [currentGame]);

    const handleSort = (key: keyof PlayerData) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const handleSelectPlayer = (playerId: number) => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers((prev) => prev.filter((id) => id !== playerId));
        } else {
            setSelectedPlayers((prev) => [...prev, playerId]);
        }
    };

    if (playersLoading || currentGameLoading) {
        return (
            <Container>
                <Loader />
            </Container>
        );
    }

    if (playersError) {
        return <Alert title="Error" icon={<IconAlertTriangle />}>{playersError?.message || 'An unknown error occurred'}</Alert>;
    }

    if (currentGameError) {
        return <Alert title="Error" icon={<IconAlertTriangle />}>{currentGameError?.message || 'An unknown error occurred'}</Alert>;
    }

    if (!players || !currentGame) {
        return <></>;
    }

    const filteredPlayers = players?.filter((player) => {
        const searchTerm = filter.toLowerCase();
        const searchResult = (player.name?.toLowerCase().includes(searchTerm) ||
            player.email?.toLowerCase().includes(searchTerm));

        return searchResult && (!active || player.finished === null);
    }) || [];

    const playersRepliedSince = filteredPlayers.filter((player) => {
        if (!player.lastResponded) {
            return (replyRange[1] === currentGame?.id);
        }
        else {
            const repliedAfter = ((currentGame?.id || 0) - player.lastResponded) >= replyRange[0];
            const repliedBefore = ((currentGame?.id || 0) - player.lastResponded) <= replyRange[1];

            return repliedAfter && repliedBefore;
        }
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

    return (
        <Container>
            <Title order={1}>{sortedPlayers.length} Active{active ? " " : " and Former "}Players</Title>
            <Title order={3}>who last responded between {replyRange[0]} and {replyRange[1]} weeks ago</Title>
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
            <Text size="sm">Last Response Range</Text>
            <RangeSlider
                label={(value) => `${value} weeks`}
                min={0}
                max={currentGame?.id || 0}
                step={1}
                value={replyRange}
                onChange={(event) => setReplyRange(event)}
            />
            <Checkbox
                mt={20}
                mb={20}
                label="Select All"
                checked={selectedPlayers.length === sortedPlayers.length && sortedPlayers.length > 0}
                onChange={(event) => {
                    if (event.currentTarget.checked) {
                        setSelectedPlayers(sortedPlayers.map((player) => player.id));
                    } else {
                        setSelectedPlayers([]);
                    }
                }}
            />
            <Table mt={20}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            Select
                        </Table.Th>
                        <Table.Th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                            <Flex align="center" gap="xs">
                                Name
                                {sortBy === 'name' ? (sortOrder === 'asc' ? <IconSortAscending /> : <IconSortDescending />) : ''}
                            </Flex>
                        </Table.Th>
                        <Table.Th>
                            W-D-L
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
                                <Checkbox
                                    checked={selectedPlayers.includes(player.id)}
                                    onChange={() => handleSelectPlayer(player.id)}
                                />
                            </Table.Td>
                            <Table.Td>
                                <Anchor href={`/footy/player/${encodeURIComponent(player.id || "")}`}>
                                    {player.name}
                                </Anchor>
                            </Table.Td>
                            <Table.Td>
                                <PlayerWDLChart player={player} />
                            </Table.Td>
                            <Table.Td>
                                <PlayerTimeline player={player} currentGame={currentGame} />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
};

export default Page;

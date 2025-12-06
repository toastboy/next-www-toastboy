'use client';

import { Anchor, Button, Checkbox, Flex, RangeSlider, Switch, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import MustBeLoggedIn from 'components/MustBeLoggedIn/MustBeLoggedIn';
import PlayerTimeline from 'components/PlayerTimeline/PlayerTimeline';
import PlayerWDLChart from 'components/PlayerWDLChart/PlayerWDLChart';
import SendEmailForm from 'components/SendEmailForm/SendEmailForm';
import { useCurrentGame, usePlayers } from 'lib/swr';
import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';
import { useState } from 'react';
import { PlayerDataType } from 'types';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    const players = usePlayers();
    const currentGame = useCurrentGame();
    const [sortBy, setSortBy] = useState<keyof PlayerDataType | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [active, setActive] = useState(true);
    const [replyRange, setReplyRange] = useState<[number, number]>([0, 0]);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerType[]>([]);
    const [modalOpened, setModalOpened] = useState(false);

    const handleSort = (key: keyof PlayerDataType) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const handleSelectPlayer = (player: PlayerType) => {
        if (selectedPlayers.includes(player)) {
            setSelectedPlayers((prev) => prev.filter((p) => player !== p));
        } else {
            setSelectedPlayers((prev) => [...prev, player]);
        }
    };

    if (!players || !currentGame) return null;

    // Initialize reply range once when currentGame becomes available
    if (currentGame && replyRange[1] === 0) {
        setReplyRange([0, currentGame.id]);
    }

    const filteredPlayers = players?.filter((player) => {
        const searchTerm = filter.toLowerCase();
        const searchResult = (player.name?.toLowerCase().includes(searchTerm) ??
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
        <MustBeLoggedIn>
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
                        setSelectedPlayers(sortedPlayers);
                    } else {
                        setSelectedPlayers([]);
                    }
                }}
            />
            <Text size="sm">Selected: {selectedPlayers.length}</Text>
            <Tooltip label="Send an email to the selected players">
                <Button disabled={selectedPlayers.length === 0} onClick={() => setModalOpened(true)}>Send Email...</Button>
            </Tooltip>
            <SendEmailForm players={selectedPlayers} opened={modalOpened} onClose={() => setModalOpened(false)} />

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
                                    checked={selectedPlayers.includes(player)}
                                    onChange={() => handleSelectPlayer(player)}
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
                                <PlayerTimeline player={player} currentGameId={currentGame.id} />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </MustBeLoggedIn>
    );
};

export default Page;

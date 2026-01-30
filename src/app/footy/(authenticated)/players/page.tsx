'use client';

import { Anchor, Box, Button, Checkbox, Flex, RangeSlider, Switch, Table, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { PlayerTimeline } from 'components/PlayerTimeline/PlayerTimeline';
import { PlayerWDLChart } from 'components/PlayerWDLChart/PlayerWDLChart';
import { SendEmailForm } from 'components/SendEmailForm/SendEmailForm';
import { useCurrentGame, usePlayers } from 'lib/swr';
import { useState } from 'react';
import { PlayerDataType } from 'types';

import { sendEmail } from '@/actions/sendEmail';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    const players = usePlayers();
    const currentGame = useCurrentGame();
    const [sortBy, setSortBy] = useState<keyof PlayerDataType | null>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filter, setFilter] = useState('');
    const [active, setActive] = useState(true);
    const [replyRange, setReplyRange] = useState<[number, number]>([0, 0]);
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerDataType[]>([]);
    const [modalOpened, setModalOpened] = useState(false);

    const handleSort = (key: keyof PlayerDataType) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const handleSelectPlayer = (player: PlayerDataType) => {
        if (selectedPlayers.includes(player)) {
            setSelectedPlayers((prev) => prev.filter((p) => player !== p));
        } else {
            setSelectedPlayers((prev) => [...prev, player]);
        }
    };

    if (!players) return null;

    const hasCurrentGame = Boolean(currentGame);
    const currentGameId = currentGame?.id ?? 0;

    // Now we know currentGame is defined we can set the default replyRange
    if (hasCurrentGame && replyRange[1] === 0) setReplyRange([replyRange[0], currentGameId]);

    const filteredPlayers = players?.filter((player) => {
        const searchTerm = filter.toLowerCase();
        const nameMatches = player.name?.toLowerCase().includes(searchTerm) ?? false;
        const emailMatches = [player.accountEmail, ...player.extraEmails.map((playerEmail) => playerEmail.email)]
            .filter((playerEmail): playerEmail is string => !!playerEmail)
            .some((playerEmail) => playerEmail.toLowerCase().includes(searchTerm));
        const searchResult = nameMatches || emailMatches;

        return searchResult && (!active || player.finished === null);
    }) || [];

    const playersRepliedSince = hasCurrentGame ? filteredPlayers.filter((player) => {
        if (!player.lastResponded) {
            return (replyRange[1] === currentGameId);
        }
        else {
            const repliedAfter = (currentGameId - player.lastResponded) >= replyRange[0];
            const repliedBefore = (currentGameId - player.lastResponded) <= replyRange[1];

            return repliedAfter && repliedBefore;
        }
    }) : filteredPlayers;

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
        <Box>
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
                max={currentGameId}
                step={1}
                value={replyRange}
                onChange={(event) => setReplyRange(event)}
            />
            <Checkbox
                mt={20}
                mb={20}
                label="Select All"
                data-testid="players-select-all"
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
                <Button
                    data-testid="players-send-email"
                    disabled={selectedPlayers.length === 0}
                    onClick={() => setModalOpened(true)}
                >
                    Send Email...
                </Button>
            </Tooltip>
            <SendEmailForm
                players={selectedPlayers}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSendEmail={sendEmail}
            />

            <Table mt={20} data-testid="players-table" data-row-count={sortedPlayers.length}>
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
                        <Table.Tr key={player.id} data-testid="players-table-row">
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
                                <PlayerTimeline player={player} currentGameId={currentGameId} />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Box>
    );
};

export default Page;

'use client';

import {
    Anchor,
    Box,
    Button,
    Checkbox,
    Group,
    Image,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { config } from '@/lib/config';
import type { SetDrinkersInput, SetDrinkersProxy } from '@/types/actions/SetDrinkers';
import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

export interface DrinkersFormProps {
    gameId: number;
    gameDate: string;
    players: OutcomePlayerType[];
    setDrinkers: SetDrinkersProxy;
}

const normaliseName = (row: OutcomePlayerType) => row.player.name ?? `Player ${row.playerId}`;

const sortRows = (rows: OutcomePlayerType[]) => [...rows].sort((a, b) => {
    const teamBucketDiff = (a.team ? 0 : 1) - (b.team ? 0 : 1);
    if (teamBucketDiff !== 0) return teamBucketDiff;
    return normaliseName(a).localeCompare(normaliseName(b));
});

const toSelectedIds = (rows: OutcomePlayerType[]) => rows
    .filter((row) => (row.pub ?? 0) > 0)
    .map((row) => row.playerId);

const isSameSelection = (left: number[], right: number[]) => {
    if (left.length !== right.length) return false;
    const rightSet = new Set(right);
    return left.every((id) => rightSet.has(id));
};

export const DrinkersForm: React.FC<DrinkersFormProps> = ({
    gameId,
    gameDate,
    players,
    setDrinkers,
}) => {
    const router = useRouter();
    const [rows, setRows] = useState<OutcomePlayerType[]>(() => sortRows(players));
    const [selectedIds, setSelectedIds] = useState<number[]>(() => toSelectedIds(players));
    const [savedSelectedIds, setSavedSelectedIds] = useState<number[]>(() => toSelectedIds(players));
    const [filter, setFilter] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setRows(sortRows(players));
        const selected = toSelectedIds(players);
        setSelectedIds(selected);
        setSavedSelectedIds(selected);
    }, [players]);

    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const visibleRows = useMemo(() => {
        const searchTerm = filter.trim().toLowerCase();
        if (!searchTerm) return rows;

        return rows.filter((row) => normaliseName(row).toLowerCase().includes(searchTerm));
    }, [rows, filter]);

    const allVisibleSelected =
        visibleRows.length > 0 &&
        visibleRows.every((row) => selectedIdSet.has(row.playerId));

    const someVisibleSelected =
        visibleRows.some((row) => selectedIdSet.has(row.playerId)) && !allVisibleSelected;

    const hasChanges = !isSameSelection(selectedIds, savedSelectedIds);

    const togglePlayer = (playerId: number, checked: boolean) => {
        setSelectedIds((current) => {
            if (checked) {
                return current.includes(playerId) ? current : [...current, playerId];
            }

            return current.filter((id) => id !== playerId);
        });
    };

    const toggleVisible = (checked: boolean) => {
        const visibleIds = visibleRows.map((row) => row.playerId);
        const visibleIdSet = new Set(visibleIds);

        setSelectedIds((current) => {
            if (checked) {
                return Array.from(new Set([...current, ...visibleIds]));
            }

            return current.filter((id) => !visibleIdSet.has(id));
        });
    };

    const handleSave = async () => {
        const payload: SetDrinkersInput = {
            gameDayId: gameId,
            players: rows.map((row) => ({
                playerId: row.playerId,
                drinker: selectedIdSet.has(row.playerId),
            })),
        };

        const notificationId = 'drinkers-save';
        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Saving drinkers',
            message: 'Updating pub attendance...',
            autoClose: false,
            withCloseButton: false,
        });

        setIsSaving(true);
        try {
            const result = await setDrinkers(payload);

            setRows((current) => current.map((row) => {
                if (!selectedIdSet.has(row.playerId)) {
                    return { ...row, pub: null };
                }

                return { ...row, pub: row.team ? 1 : 2 };
            }));
            setSavedSelectedIds(selectedIds);

            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Drinkers updated',
                message: `${result.drinkers} players marked for pub attendance.`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });

            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update drinkers';
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Stack gap="md" data-testid="drinkers-form">
            <Stack gap={4}>
                <Title order={2}>Game {gameId} Drinkers</Title>
                <Text c="dimmed">{gameDate}</Text>
                <Text c="dimmed">Selected: {selectedIds.length}</Text>
            </Stack>

            <TextInput
                placeholder="Search players"
                value={filter}
                onChange={(event) => setFilter(event.currentTarget.value)}
            />

            {rows.length > 0 ? (
                <>
                    <Checkbox
                        label="Select all visible players"
                        checked={allVisibleSelected}
                        indeterminate={someVisibleSelected}
                        onChange={(event) => toggleVisible(event.currentTarget.checked)}
                    />

                    <Table withTableBorder>
                        <TableThead>
                            <TableTr>
                                <TableTh>Player</TableTh>
                                <TableTh>Team</TableTh>
                                <TableTh>Response</TableTh>
                                <TableTh>Drank</TableTh>
                            </TableTr>
                        </TableThead>
                        <TableTbody>
                            {visibleRows.map((row) => {
                                const playerName = normaliseName(row);
                                return (
                                    <TableTr key={row.playerId} data-testid="drinker-row">
                                        <TableTd>
                                            <Group wrap="nowrap" gap="sm">
                                                <Anchor href={`/footy/player/${row.playerId}`}>
                                                    <Image
                                                        w={40}
                                                        h={40}
                                                        radius="xl"
                                                        src={`/api/footy/player/${row.playerId}/mugshot`}
                                                        alt={playerName}
                                                    />
                                                </Anchor>
                                                <Anchor href={`/footy/player/${row.playerId}`}>
                                                    {playerName}
                                                </Anchor>
                                            </Group>
                                        </TableTd>
                                        <TableTd>{row.team ?? '-'}</TableTd>
                                        <TableTd>{row.response ?? '-'}</TableTd>
                                        <TableTd>
                                            <Checkbox
                                                data-testid="drinker-checkbox"
                                                aria-label={`Pub ${playerName}`}
                                                checked={selectedIdSet.has(row.playerId)}
                                                onChange={(event) => togglePlayer(
                                                    row.playerId,
                                                    event.currentTarget.checked,
                                                )}
                                            />
                                        </TableTd>
                                    </TableTr>
                                );
                            })}
                        </TableTbody>
                    </Table>

                    <Box>
                        <Button
                            type="button"
                            onClick={handleSave}
                            loading={isSaving}
                            disabled={!hasChanges}
                        >
                            Save drinkers
                        </Button>
                    </Box>
                </>
            ) : (
                <Text>No active players found</Text>
            )}
        </Stack>
    );
};

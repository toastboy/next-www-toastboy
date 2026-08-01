'use client';

import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Image,
    Paper,
    Stack,
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
import {
    useForm,
} from '@mantine/form';
import {
    notifications,
} from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { config } from '@/lib/config';
import type { SetDrinkersInput, SetDrinkersProxy } from '@/types/actions/SetDrinkers';
import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

interface DrinkersFormProps {
    gameId: number;
    gameDate: string;
    players: OutcomePlayerType[];
    setDrinkers: SetDrinkersProxy;
    previousGameId?: number;
    nextGameId?: number;
}

export const DrinkersForm = ({
    gameId,
    gameDate,
    players,
    setDrinkers,
    previousGameId,
    nextGameId,
}: DrinkersFormProps) => {
    const router = useRouter();
    const [rows, setRows] = useState<OutcomePlayerType[]>(players);
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('team');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [isSaving, setIsSaving] = useState(false);
    const [prevPlayers, setPrevPlayers] = useState(players);
    const form = useForm({
        initialValues: {
            selectedIds: toSelectedIds(players),
        },
    });

    if (prevPlayers !== players) {
        setPrevPlayers(players);
        setRows(players);
        const selected = toSelectedIds(players);
        form.setFieldValue('selectedIds', selected);
        form.resetDirty({ selectedIds: selected });
    }

    const selectedIdSet = useMemo(() => new Set(form.values.selectedIds), [form.values.selectedIds]);

    const filteredRows = useMemo(() => {
        const searchTerm = filter.trim().toLowerCase();
        if (!searchTerm) return rows;

        return rows.filter((row) => normaliseName(row).toLowerCase().includes(searchTerm));
    }, [rows, filter]);

    const visibleRows = useMemo(() => {
        const data = [...filteredRows];
        data.sort((a, b) => {
            switch (sortKey) {
                case 'name':
                    return compareNullableString(a.player.name, b.player.name, sortDirection);
                case 'team':
                    return compareNullableString(a.team, b.team, sortDirection);
                case 'response':
                    return compareNullableString(a.response, b.response, sortDirection);
                /* v8 ignore next 2 -- SortKey is a union type; default is unreachable */
                default:
                    return 0;
            }
        });
        return data;
    }, [filteredRows, sortKey, sortDirection]);

    const allVisibleSelected =
        visibleRows.length > 0 &&
        visibleRows.every((row) => selectedIdSet.has(row.playerId));

    const someVisibleSelected =
        visibleRows.some((row) => selectedIdSet.has(row.playerId)) && !allVisibleSelected;

    const hasChanges = form.isDirty();

    const togglePlayer = (playerId: number, checked: boolean) => {
        if (checked) {
            /* v8 ignore next -- defensive guard against duplicate adds; normal checkbox behaviour never fires checked=true when already selected */
            form.setFieldValue('selectedIds', form.values.selectedIds.includes(playerId) ?
                form.values.selectedIds :
                [...form.values.selectedIds, playerId]);
            return;
        }

        form.setFieldValue('selectedIds', form.values.selectedIds.filter((id) => id !== playerId));
    };

    const toggleVisible = (checked: boolean) => {
        const visibleIds = visibleRows.map((row) => row.playerId);
        const visibleIdSet = new Set(visibleIds);

        if (checked) {
            form.setFieldValue('selectedIds', Array.from(new Set([...form.values.selectedIds, ...visibleIds])));
            return;
        }

        form.setFieldValue('selectedIds', form.values.selectedIds.filter((id) => !visibleIdSet.has(id)));
    };

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            return;
        }
        setSortKey(key);
        setSortDirection('asc');
    };

    const getSortIcon = (key: SortKey) => {
        if (key !== sortKey) return <IconSelector size={14} />;
        return sortDirection === 'asc' ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />;
    };

    const renderSortHeader = (label: string, key: SortKey) => (
        <UnstyledButton
            type="button"
            onClick={() => handleSort(key)}
            aria-label={`Sort by ${label}`}
        >
            <Group gap={6} wrap="nowrap">
                <Text span>{label}</Text>
                {getSortIcon(key)}
            </Group>
        </UnstyledButton>
    );

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
            form.resetDirty(form.values);

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

    const renderedRows = visibleRows.map((row) => {
        const playerName = normaliseName(row);
        return (
            <TableTr key={row.playerId}>
                <TableTd w="2.5rem">
                    <Checkbox
                        checked={selectedIdSet.has(row.playerId)}
                        onChange={(event) => togglePlayer(row.playerId, event.currentTarget.checked)}
                        aria-label={`Pub ${playerName}`}
                    />
                </TableTd>
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
            </TableTr>
        );
    });

    return (
        <Container size="lg" py="lg">
            <Group justify="space-between" mb="md">
                {previousGameId ?
                    <Anchor href={`/footy/admin/drinkers/${previousGameId}`}>Previous</Anchor> :
                    <span />}
                {nextGameId ?
                    <Anchor href={`/footy/admin/drinkers/${nextGameId}`}>Next</Anchor> :
                    <span />}
            </Group>
            <Paper w="100%">
                <Stack gap="md">
                    <Stack gap={4}>
                        <Title order={2}>Game {gameId} Drinkers</Title>
                        <Text c="dimmed">{gameDate}</Text>
                        <Text fw={700}>
                            {visibleRows.length} of {rows.length} visible, {form.values.selectedIds.length} selected
                        </Text>
                    </Stack>

                    {rows.length > 0 ? (
                        <>
                            <Group justify="space-between" align="flex-end" wrap="wrap">
                                <TextInput
                                    label="Name"
                                    size="xs"
                                    placeholder="Search players"
                                    value={filter}
                                    onChange={(event) => setFilter(event.currentTarget.value)}
                                />
                                <Button
                                    type="button"
                                    size="xs"
                                    onClick={handleSave}
                                    loading={isSaving}
                                    disabled={!hasChanges}
                                >
                                    Save drinkers
                                </Button>
                            </Group>

                            <TableScrollContainer minWidth={480} scrollAreaProps={{ type: 'auto' }}>
                                <Table
                                    striped
                                    highlightOnHover
                                    withTableBorder
                                    withColumnBorders
                                    w="100%"
                                    layout="fixed"
                                >
                                    <TableThead>
                                        <TableTr>
                                            <TableTh w="2.5rem">
                                                <Checkbox
                                                    checked={allVisibleSelected}
                                                    indeterminate={someVisibleSelected}
                                                    onChange={(event) => toggleVisible(event.currentTarget.checked)}
                                                    aria-label="Select all visible players"
                                                />
                                            </TableTh>
                                            <TableTh aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                                {renderSortHeader('Player', 'name')}
                                            </TableTh>
                                            <TableTh w="6rem" aria-sort={sortKey === 'team' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                                {renderSortHeader('Team', 'team')}
                                            </TableTh>
                                            <TableTh w="8rem" aria-sort={sortKey === 'response' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                                {renderSortHeader('Response', 'response')}
                                            </TableTh>
                                        </TableTr>
                                    </TableThead>
                                    <TableTbody>{renderedRows}</TableTbody>
                                </Table>
                            </TableScrollContainer>
                        </>
                    ) : (
                        <Text>No active players found</Text>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
};

type SortKey = 'name' | 'team' | 'response';
type SortDirection = 'asc' | 'desc';

const compareNullableString = (
    a: string | null | undefined,
    b: string | null | undefined,
    direction: SortDirection,
) => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    const result = a.localeCompare(b);
    return direction === 'asc' ? result : -result;
};

const normaliseName = (row: OutcomePlayerType) => row.player.name ?? `Player ${row.playerId}`;

const toSelectedIds = (rows: OutcomePlayerType[]) => rows
    .filter((row) => (row.pub ?? 0) > 0)
    .map((row) => row.playerId);

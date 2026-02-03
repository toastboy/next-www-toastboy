'use client';

import {
    Button,
    Card,
    Checkbox,
    Flex,
    Group,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import React, { useMemo, useState } from 'react';

export type AdminPlayerResponse = 'Yes' | 'No' | 'Dunno' | null;

export interface AdminResponseRow {
    playerId: number;
    playerName: string;
    response: AdminPlayerResponse;
    goalie: boolean;
    comment: string;
}

export interface ResponsesProps {
    gameId: number;
    gameDate: string;
    responses: AdminResponseRow[];
    onSave?: (update: {
        gameDayId: number;
        playerId: number;
        response: Exclude<AdminPlayerResponse, null>;
        goalie: boolean;
        comment: string;
    }) => Promise<void>;
}

export const Responses: React.FC<ResponsesProps> = ({ gameId, gameDate, responses, onSave }) => {
    const [rows, setRows] = useState<AdminResponseRow[]>(responses);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const saveHandler = onSave ?? (async (update) => {
        const res = await fetch('/api/footy/admin/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update),
        });
        if (!res.ok) {
            const body: unknown = await res.json().catch(() => ({}));
            const msg = typeof (body as { message?: unknown }).message === 'string'
                ? (body as { message: string }).message
                : 'Failed to update response';
            throw new Error(msg);
        }
    });

    const grouped = useMemo(() => {
        return {
            yes: rows.filter((r) => r.response === 'Yes'),
            no: rows.filter((r) => r.response === 'No'),
            none: rows.filter((r) => r.response === null || r.response === 'Dunno'),
        };
    }, [rows]);

    const handleSubmit = async (row: AdminResponseRow) => {
        if (!row.response || row.response === 'Dunno') return;
        setSavingId(row.playerId);
        try {
            await saveHandler({
                gameDayId: gameId,
                playerId: row.playerId,
                response: row.response,
                goalie: row.goalie,
                comment: row.comment,
            });
            setMessage('Response updated');
            setError('');
            setRows((current) =>
                current.map((r) => (r.playerId === row.playerId ? row : r)),
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update response');
        } finally {
            setSavingId(null);
        }
    };

    const renderGroup = (title: string, testId: string, items: AdminResponseRow[]) => (
        <Card withBorder shadow="xs" p="md" data-testid={testId} data-count={items.length}>
            <Group justify="space-between" mb="sm">
                <Title order={4}>{title} ({items.length})</Title>
            </Group>
            <Stack gap="sm">
                {items.map((row) => (
                    <Flex
                        key={row.playerId}
                        data-testid="response-row"
                        data-player-id={row.playerId}
                        align="flex-start"
                        gap="sm"
                        wrap="wrap"
                    >
                        <Text data-testid="player-name" fw={600} w={180}>
                            {row.playerName}
                        </Text>
                        <Flex direction="column" gap="xs">
                            <label htmlFor={`response-select-${row.playerId}`}>
                                Response
                            </label>
                            <select
                                id={`response-select-${row.playerId}`}
                                data-testid="response-select"
                                value={row.response ?? 'None'}
                                onChange={(e) => {
                                    const value = e.currentTarget.value as AdminPlayerResponse | 'None';
                                    setRows((current) =>
                                        current.map((r) =>
                                            r.playerId === row.playerId
                                                ? { ...r, response: value === 'None' ? null : value }
                                                : r,
                                        ),
                                    );
                                }}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="Dunno">Dunno</option>
                                <option value="None">None</option>
                            </select>
                        </Flex>
                        <Checkbox
                            data-testid="goalie-checkbox"
                            label="Goalie"
                            checked={row.goalie}
                            onChange={(e) => {
                                const checked = e.currentTarget.checked;
                                setRows((current) =>
                                    current.map((r) =>
                                        r.playerId === row.playerId ? { ...r, goalie: checked } : r,
                                    ),
                                );
                            }}
                        />
                        <TextInput
                            data-testid="comment-input"
                            placeholder="Comment"
                            value={row.comment}
                            onChange={(e) => {
                                const value = e.currentTarget.value;
                                setRows((current) =>
                                    current.map((r) =>
                                        r.playerId === row.playerId ? { ...r, comment: value } : r,
                                    ),
                                );
                            }}
                            w={240}
                        />
                        <Button
                            data-testid="response-submit"
                            variant="filled"
                            disabled={savingId === row.playerId}
                            onClick={() => handleSubmit(row)}
                        >
                            Update
                        </Button>
                    </Flex>
                ))}
            </Stack>
        </Card>
    );

    // stable ordering: yes, no, none
    return (
        <Stack gap="md">
            <div>
                <Title order={2}>Responses</Title>
                <Text c="dimmed">Game {gameId}: {gameDate}</Text>
            </div>
            {!!message && (
                <Text role="status" c="teal" fw={600}>
                    {message}
                </Text>
            )}
            {!!error && (
                <Text role="alert" c="red" fw={600}>
                    {error}
                </Text>
            )}
            {renderGroup('Yes', 'response-group-yes', grouped.yes)}
            {renderGroup('No', 'response-group-no', grouped.no)}
            {renderGroup('None', 'response-group-none', grouped.none)}
        </Stack>
    );
};

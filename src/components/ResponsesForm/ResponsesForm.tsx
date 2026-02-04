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
import { useForm } from '@mantine/form';
import React, { useMemo, useState } from 'react';

import { SubmitAdminResponseProxy } from '@/types/actions/SubmitAdminResponse';
import { OutcomePlayerType } from '@/types/OutcomePlayerType';

export interface ResponsesFormProps {
    gameId: number;
    gameDate: string;
    responses: OutcomePlayerType[];
    submitAdminResponse?: SubmitAdminResponseProxy;
}

enum ResponseOption {
    Yes = 'Yes',
    No = 'No',
    Dunno = 'Dunno',
    None = 'None',
}

type ResponseValues = Pick<OutcomePlayerType, 'response' | 'goalie' | 'comment'>;
interface ResponsesFormValues {
    byPlayerId: Record<number, ResponseValues>;
}

const toResponseValues = (row: OutcomePlayerType): ResponseValues => ({
    response: row.response ?? null,
    goalie: !!row.goalie,
    comment: row.comment ?? '',
});

export const ResponsesForm: React.FC<ResponsesFormProps> = ({
    gameId,
    gameDate,
    responses,
    submitAdminResponse,
}) => {
    const [rows, setRows] = useState<OutcomePlayerType[]>(responses);
    const form = useForm<ResponsesFormValues>({
        initialValues: {
            byPlayerId: Object.fromEntries(responses.map((row) => [row.playerId, toResponseValues(row)])),
        },
    });
    const [savingId, setSavingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState('');

    const grouped = useMemo(() => {
        const filteredRows = rows.filter((row) => {
            const searchTerm = filter.toLowerCase();
            return (row.player.name?.toLowerCase().includes(searchTerm));
        }) ?? [];

        return {
            yes: filteredRows.filter((r) => r.response === ResponseOption.Yes),
            no: filteredRows.filter((r) => r.response === ResponseOption.No),
            dunno: filteredRows.filter((r) => r.response === ResponseOption.Dunno),
            none: filteredRows.filter((r) => r.response == null),
        };
    }, [rows, filter]);

    const submitHandler = submitAdminResponse ?? (async (input) => {
        const res = await fetch('/api/footy/admin/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
        if (!res.ok) {
            const body: unknown = await res.json().catch(() => ({}));
            const msg = typeof (body as { message?: unknown }).message === 'string'
                ? (body as { message: string }).message
                : 'Failed to update response';
            throw new Error(msg);
        }
        return null;
    });

    const handleSubmit = async (row: OutcomePlayerType) => {
        const responseValues = form.values.byPlayerId[row.playerId] ?? toResponseValues(row);
        if (!responseValues.response) return;

        setSavingId(row.playerId);
        try {
            await submitHandler({
                gameDayId: gameId,
                playerId: row.playerId,
                response: responseValues.response,
                goalie: !!responseValues.goalie,
                comment: responseValues.comment,
            });
            setMessage('Response updated');
            setError('');
            setRows((current) =>
                current.map((r) => (r.playerId === row.playerId ? { ...r, ...responseValues } : r)),
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update response');
        } finally {
            setSavingId(null);
        }
    };

    const renderGroup = (title: string, testId: string, items: OutcomePlayerType[]) => (
        <Card withBorder shadow="xs" p="md" data-testid={testId} data-count={items.length}>
            <Group justify="space-between" mb="sm">
                <Title order={4}>{title} ({items.length})</Title>
            </Group>
            <Stack gap="sm">
                {items.map((row) => {
                    const responseValues = form.values.byPlayerId[row.playerId] ?? toResponseValues(row);
                    return (
                        <Flex
                            key={row.playerId}
                            data-testid="response-row"
                            data-player-id={row.playerId}
                            align="flex-start"
                            gap="sm"
                            wrap="wrap"
                        >
                            <Text data-testid="player-name" fw={600} w={180}>
                                {row.player.name}
                            </Text>
                            <Flex direction="column" gap="xs">
                                <label htmlFor={`response-select-${row.playerId}`}>
                                    Response
                                </label>
                                <select
                                    id={`response-select-${row.playerId}`}
                                    data-testid="response-select"
                                    value={responseValues.response ?? 'None'}
                                    onChange={(e) => {
                                        const value = e.currentTarget.value as OutcomePlayerType['response'] | 'None';
                                        form.setFieldValue(
                                            `byPlayerId.${row.playerId}.response`,
                                            value === 'None' ? null : value,
                                        );
                                    }}
                                >
                                    {Object.values(ResponseOption).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </Flex>
                            <Checkbox
                                data-testid="goalie-checkbox"
                                label="Goalie"
                                {...form.getInputProps(
                                    `byPlayerId.${row.playerId}.goalie`,
                                    { type: 'checkbox' },
                                )}
                            />
                            <TextInput
                                data-testid="comment-input"
                                placeholder="Comment"
                                {...form.getInputProps(`byPlayerId.${row.playerId}.comment`)}
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
                    );
                })}
            </Stack>
        </Card>
    );

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
            <TextInput
                placeholder="Search players"
                value={filter}
                onChange={(event) => setFilter(event.currentTarget.value)}
            />
            {Object.values(ResponseOption).map((option) => (
                <React.Fragment key={option}>
                    {
                        renderGroup(
                            option,
                            `response-group-${option.toLowerCase()}`,
                            grouped[option.toLowerCase() as keyof typeof grouped],
                        )
                    }
                </React.Fragment>
            ))}
        </Stack>
    );
};

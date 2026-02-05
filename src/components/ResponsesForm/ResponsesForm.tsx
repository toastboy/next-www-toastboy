'use client';

import type { MantineColor } from '@mantine/core';
import {
    Button,
    Card,
    Checkbox,
    Flex,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';

import { config } from '@/lib/config';
import { SubmitAdminResponseProxy } from '@/types/actions/SubmitAdminResponse';
import { OutcomePlayerType } from '@/types/OutcomePlayerType';

export interface ResponsesFormProps {
    gameId: number;
    gameDate: string;
    responses: OutcomePlayerType[];
    submitAdminResponse: SubmitAdminResponseProxy;
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

const responseGroupBarColor: Record<ResponseOption, MantineColor> = {
    [ResponseOption.Yes]: 'green.6',
    [ResponseOption.No]: 'red.6',
    [ResponseOption.Dunno]: 'yellow.6',
    [ResponseOption.None]: 'gray.6',
};

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
    const [filter, setFilter] = useState('');

    const isRowDirty = (row: OutcomePlayerType) => {
        const baseline = toResponseValues(row);
        const current = form.values.byPlayerId[row.playerId] ?? baseline;

        return (
            baseline.response !== current.response ||
            baseline.goalie !== current.goalie ||
            baseline.comment !== current.comment
        );
    };

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

    const handleSubmit = async (row: OutcomePlayerType) => {
        const responseValues = form.values.byPlayerId[row.playerId] ?? toResponseValues(row);
        if (!responseValues.response) return;

        const notificationId = `response-${row.playerId}`;
        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Updating response',
            message: 'Updating response...',
            autoClose: false,
            withCloseButton: false,
        });

        setSavingId(row.playerId);
        try {
            await submitAdminResponse({
                gameDayId: gameId,
                playerId: row.playerId,
                response: responseValues.response,
                goalie: !!responseValues.goalie,
                comment: responseValues.comment,
            });
            setRows((current) =>
                current.map((r) => (r.playerId === row.playerId ? { ...r, ...responseValues } : r)),
            );
            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Response updated',
                message: 'Response updated successfully',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update response';
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: errorMessage,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        } finally {
            setSavingId(null);
        }
    };

    const renderGroup = (title: ResponseOption, testId: string, items: OutcomePlayerType[]) => (
        <Card withBorder shadow="xs" p="md" data-testid={testId} data-count={items.length}>
            <Card.Section h={6} bg={responseGroupBarColor[title]} />
            <Group justify="space-between" mb="lg" mt="md">
                <Title order={2}>{title}: {items.length}</Title>
            </Group>
            <Stack gap="sm">
                {items.map((row) => {
                    const responseValues = form.values.byPlayerId[row.playerId] ?? toResponseValues(row);
                    return (
                        <Flex
                            key={row.playerId}
                            data-testid="response-row"
                            data-player-id={row.playerId}
                            align="center"
                            gap="sm"
                            wrap="nowrap"
                        >
                            <Text data-testid="player-name" fw={600} w={180}>
                                {row.player.name}
                            </Text>
                            <Select
                                data-testid="response-select"
                                aria-label="Response"
                                data={Object.values(ResponseOption).map((option) => ({
                                    value: option,
                                    label: option,
                                }))}
                                value={responseValues.response ?? ResponseOption.None}
                                onChange={(value) => {
                                    const nextValue = value as ResponseOption | null;
                                    form.setFieldValue(
                                        `byPlayerId.${row.playerId}.response`,
                                        nextValue === ResponseOption.None ? null : nextValue,
                                    );
                                }}
                                size="sm"
                                w={160}
                            />
                            <Checkbox
                                data-testid="goalie-checkbox"
                                label="Goalie"
                                size="sm"
                                {...form.getInputProps(
                                    `byPlayerId.${row.playerId}.goalie`,
                                    { type: 'checkbox' },
                                )}
                            />
                            <TextInput
                                data-testid="comment-input"
                                placeholder="Comment"
                                {...form.getInputProps(`byPlayerId.${row.playerId}.comment`)}
                                size="sm"
                                style={{ flex: 1, minWidth: 220 }}
                            />
                            <Button
                                data-testid="response-submit"
                                variant="filled"
                                size="sm"
                                disabled={!isRowDirty(row)}
                                loading={savingId === row.playerId}
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
            <Stack align="left" gap="xs">
                <Title order={2}>Responses</Title>
                <Text c="dimmed">Game {gameId}: {gameDate}</Text>
                <TextInput
                    placeholder="Search players"
                    value={filter}
                    onChange={(event) => setFilter(event.currentTarget.value)}
                />
            </Stack>
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

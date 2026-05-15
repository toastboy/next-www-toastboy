'use client';

import type { MantineColor } from '@mantine/core';
import {
    Button,
    Card,
    CardSection,
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
import { PlayerResponse } from 'prisma/generated/enums';
import { useEffect, useMemo, useRef, useState } from 'react';

import { config } from '@/lib/config';
import { SubmitResponseProxy } from '@/types/actions/SubmitResponse';
import { OutcomePlayerType } from '@/types/OutcomePlayerType';

interface ResponsesFormProps {
    gameId: number;
    gameDate: string;
    responses: OutcomePlayerType[];
    submitResponse: SubmitResponseProxy;
}

type ResponseOption = PlayerResponse | 'None';
const ResponseOption = {
    ...PlayerResponse,
    None: 'None' as const,
};

type ResponseValues = Pick<OutcomePlayerType, 'response' | 'goalie' | 'comment'>;
interface ResponsesFormValues {
    byPlayerId: Record<number, ResponseValues>;
}

const toResponseValues = (row: OutcomePlayerType): ResponseValues => ({
    response: row.response ?? null,
    goalie: !!row.goalie,
    // v8 ignore next -- comment is always a string in practice (Prisma default '')
    comment: row.comment ?? '',
});

const responseGroupBarColor: Record<ResponseOption, MantineColor> = {
    [ResponseOption.Yes]: 'green.6',
    [ResponseOption.No]: 'red.6',
    [ResponseOption.Dunno]: 'yellow.6',
    [ResponseOption.Excused]: 'gray.6',
    [ResponseOption.Flaked]: 'gray.6',
    [ResponseOption.Injured]: 'gray.6',
    [ResponseOption.None]: 'gray.6',
};

export const ResponsesForm = ({
    gameId,
    gameDate,
    responses,
    submitResponse,
}: ResponsesFormProps) => {
    const form = useForm<ResponsesFormValues>({
        initialValues: {
            byPlayerId: Object.fromEntries(responses.map((row) => [row.playerId, toResponseValues(row)])),
        },
    });
    const [savingId, setSavingId] = useState<number | null>(null);
    const [filter, setFilter] = useState('');

    // Re-sync form values when the responses prop changes (e.g. after
    // revalidate / SSE refresh). Preserve any in-progress edits by only
    // overwriting rows whose form values still match the previous baseline.
    const prevResponsesRef = useRef(responses);
    useEffect(() => {
        const prevBaselineById = new Map(
            prevResponsesRef.current.map((row) => [row.playerId, toResponseValues(row)]),
        );
        for (const row of responses) {
            const newBaseline = toResponseValues(row);
            const oldBaseline = prevBaselineById.get(row.playerId) ?? newBaseline;
            const current = form.values.byPlayerId[row.playerId];
            const userEdited =
                !!current && (
                    current.response !== oldBaseline.response ||
                    current.goalie !== oldBaseline.goalie ||
                    current.comment !== oldBaseline.comment
                );
            if (!userEdited) {
                form.setFieldValue(`byPlayerId.${row.playerId}`, newBaseline);
            }
        }
        prevResponsesRef.current = responses;
        // eslint-disable-next-line react-hooks/exhaustive-deps -- form identity is stable; we only want to react to responses changes
    }, [responses]);

    const isRowDirty = (row: OutcomePlayerType) => {
        const baseline = toResponseValues(row);
        // v8 ignore next -- form is always initialised from the same rows array
        const current = form.values.byPlayerId[row.playerId] ?? baseline;

        return (
            baseline.response !== current.response ||
            baseline.goalie !== current.goalie ||
            baseline.comment !== current.comment
        );
    };

    const grouped = useMemo(() => {
        const filteredRows = responses.filter((row) => {
            const searchTerm = filter.toLowerCase();
            // v8 ignore next -- optional chaining on name is a type-safety guard
            return (row.player.name?.toLowerCase().includes(searchTerm));
        });

        return {
            yes: filteredRows.filter((r) => r.response === ResponseOption.Yes),
            no: filteredRows.filter((r) => r.response === ResponseOption.No),
            dunno: filteredRows.filter((r) => r.response === ResponseOption.Dunno),
            excused: filteredRows.filter((r) => r.response === ResponseOption.Excused),
            flaked: filteredRows.filter((r) => r.response === ResponseOption.Flaked),
            injured: filteredRows.filter((r) => r.response === ResponseOption.Injured),
            none: filteredRows.filter((r) => r.response == null),
        };
    }, [responses, filter]);

    const handleSubmit = async (row: OutcomePlayerType) => {
        // v8 ignore next -- form is always initialised from the same rows array
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
            await submitResponse({
                gameDayId: gameId,
                playerId: row.playerId,
                response: responseValues.response,
                goalie: !!responseValues.goalie,
                // v8 ignore next -- form normalises null to '' at init, so comment is always a string
                comment: responseValues.comment ?? null,
            });
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

    const renderGroup = (title: ResponseOption, testId: string, items: OutcomePlayerType[]) => {
        if (items.length === 0) return null;

        return (
            <Card key={title} withBorder shadow="xs" p="md" data-testid={testId} data-count={items.length}>
                <CardSection h={6} bg={responseGroupBarColor[title]} />
                <Group justify="space-between" mb="lg" mt="md">
                    <Title order={2}>{title}: {items.length}</Title>
                </Group>
                <Stack gap="sm">
                    {items.map((row) => {
                        // v8 ignore next -- form is always initialised from the same rows array
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
                                    data={Object.values(PlayerResponse).map((option) => ({
                                        value: option,
                                        label: option,
                                    }))}
                                    value={responseValues.response ?? ResponseOption.None}
                                    onChange={(value) => {
                                        const nextValue = value;
                                        form.setFieldValue(
                                            `byPlayerId.${row.playerId}.response`,
                                            // v8 ignore next -- 'None' never appears in the Select data array
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
    };

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
                renderGroup(
                    option,
                    `response-group-${option.toLowerCase()}`,
                    grouped[option.toLowerCase() as keyof typeof grouped],
                )
            ))}
        </Stack>
    );
};

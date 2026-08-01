'use client';

import {
    Box,
    Button,
    Checkbox,
    Container,
    Group,
    NumberInput,
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
} from '@mantine/core';
import {
    useForm,
} from '@mantine/form';
import {
    notifications,
} from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Fragment } from 'react';

import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import {
    fromPounds,
    toPounds,
} from '@/lib/money';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type {
    CreateMoreGameDaysInput,
    CreateMoreGameDaysProxy,
} from '@/types/actions/CreateMoreGameDays';
import {
    CreateMoreGameDaysSchema,
} from '@/types/actions/CreateMoreGameDays';

// Breakpoint at which the submit button switches from a full-width mobile
// touch target to an inline fit-content button.
const actionsBreakpoint = 'sm';

interface Props {
    cost: CreateMoreGameDaysInput['cost'];
    hallCost: CreateMoreGameDaysInput['hallCost'];
    rows: CreateMoreGameDaysInput['rows'];
    onCreateMoreGameDays: CreateMoreGameDaysProxy;
}

export const MoreGamesForm = ({
    cost,
    hallCost,
    rows,
    onCreateMoreGameDays,
}: Props) => {
    const form = useForm<CreateMoreGameDaysInput>({
        initialValues: {
            cost: toPounds(cost),
            hallCost: toPounds(hallCost),
            rows,
        },
        validate: zod4Resolver(CreateMoreGameDaysSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (values: CreateMoreGameDaysInput) => {
        const id = notifications.show({
            loading: true,
            title: 'Creating game days',
            message: 'Creating game days...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const transformedValues = {
                ...values,
                cost: fromPounds(values.cost),
                hallCost: fromPounds(values.hallCost),
            };

            await onCreateMoreGameDays(transformedValues);

            notifications.update({
                id,
                color: 'teal',
                title: 'Game days created',
                message: 'Game days created successfully',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'MoreGamesForm',
                action: 'createMoreGameDays',
                route: '/footy/admin/moregames',
                extra: {
                    rowCount: values.rows.length,
                },
            });
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: toPublicMessage(err, 'Failed to create game days.'),
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const monthFormatter = new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
    });

    const groupedRows = form.values.rows.reduce<
        { label: string; rows: { row: typeof form.values.rows[number]; index: number }[] }[]
    >(
        (acc, row, index) => {
            const date = new Date(`${row.date}T00:00:00`);
            const label = monthFormatter.format(date);
            const lastGroup = acc[acc.length - 1];

            if (lastGroup?.label !== label) {
                acc.push({ label, rows: [{ row, index }] });
            } else {
                lastGroup.rows.push({ row, index });
            }

            return acc;
        },
        [],
    );

    return (
        <Container fluid>
            <Paper w="100%">
                <Box
                    component="form"
                    onSubmit={form.onSubmit(handleSubmit)}
                >
                    <Stack gap="md">
                        <Stack align="flex-start" gap="xs">
                            <Title order={2}>More games</Title>
                            <Text c="dimmed">
                                Schedule game days from the next available date through to the end of the booking year.
                            </Text>
                        </Stack>
                        <Group justify="space-between" mb="lg">
                            <NumberInput
                                label="Player charge per game"
                                aria-label="Player charge per game"
                                decimalScale={2}
                                fixedDecimalScale
                                allowNegative={false}
                                hideControls
                                min={1}
                                thousandSeparator=","
                                w="10em"
                                {...form.getInputProps('cost')}
                            />
                            <NumberInput
                                label="Hall cost per game"
                                aria-label="Hall cost per game"
                                decimalScale={2}
                                fixedDecimalScale
                                allowNegative={false}
                                hideControls
                                min={1}
                                thousandSeparator=","
                                w="10em"
                                {...form.getInputProps('hallCost')}
                            />
                        </Group>
                        <TableScrollContainer minWidth={480} scrollAreaProps={{ type: 'auto' }}>
                            <Table
                                highlightOnHover
                                withTableBorder
                            >
                                <TableThead>
                                    <TableTr>
                                        <TableTh>Date</TableTh>
                                        <TableTh>Game</TableTh>
                                        <TableTh>Comment</TableTh>
                                    </TableTr>
                                </TableThead>
                                <TableTbody>
                                    {groupedRows.map((group, groupIndex) => (
                                        <Fragment key={`${group.label}-${groupIndex}`}>
                                            <TableTr>
                                                <TableTh
                                                    colSpan={3}
                                                    bg="var(--mantine-color-gray-light)"
                                                    py="xs"
                                                    style={groupIndex > 0 ?
                                                        { borderTop: '2px solid var(--mantine-color-gray-4)' } :
                                                        undefined}
                                                >
                                                    <Text fw={700} tt="uppercase" fz="sm" lts={0.5} c="dimmed">
                                                        {group.label}
                                                    </Text>
                                                </TableTh>
                                            </TableTr>
                                            {group.rows.map(({ row, index }) => {
                                                return (
                                                    <TableTr key={row.date}>
                                                        <TableTd>
                                                            <Text fw={500}>{row.date}</Text>
                                                        </TableTd>
                                                        <TableTd>
                                                            <Checkbox
                                                                aria-label={`Game scheduled for ${row.date}`}
                                                                {...form.getInputProps(`rows.${index}.game`, { type: 'checkbox' })}
                                                            />
                                                        </TableTd>
                                                        <TableTd>
                                                            <TextInput
                                                                aria-label={`Comment for ${row.date}`}
                                                                placeholder="Optional note"
                                                                {...form.getInputProps(`rows.${index}.comment`)}
                                                            />
                                                        </TableTd>
                                                    </TableTr>
                                                );
                                            })}
                                        </Fragment>
                                    ))}
                                </TableTbody>
                            </Table>
                        </TableScrollContainer>

                        <Button
                            type="submit"
                            w={{ base: '100%', [actionsBreakpoint]: 'fit-content' }}
                        >
                            Create game days
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
};

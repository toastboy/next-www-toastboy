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
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Fragment, useState } from 'react';

import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { fromPounds, toPounds } from '@/lib/money';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type {
    CreateMoreGameDaysInput,
    CreateMoreGameDaysProxy,
} from '@/types/actions/CreateMoreGameDays';
import { CreateMoreGameDaysSchema } from '@/types/actions/CreateMoreGameDays';

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
    const [submitting, setSubmitting] = useState(false);
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

        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    const monthFormatter = new Intl.DateTimeFormat('en-GB', {
        month: 'long',
        year: 'numeric',
    });

    const groupedRows = form.values.rows.reduce<
        {
            label: string;
            rows: { row: (typeof form.values.rows)[number]; index: number }[];
        }[]
    >((acc, row, index) => {
        const date = new Date(`${row.date}T00:00:00`);
        const label = monthFormatter.format(date);
        const lastGroup = acc[acc.length - 1];

        if (lastGroup?.label !== label) {
            acc.push({ label, rows: [{ row, index }] });
        } else {
            lastGroup.rows.push({ row, index });
        }

        return acc;
    }, []);

    return (
        <Container fluid>
            <Paper w="100%">
                <Box
                    component="form"
                    onSubmit={form.onSubmit(handleSubmit)}
                >
                    <Stack gap="md">
                        <Stack
                            align="flex-start"
                            gap="xs"
                        >
                            <Title order={2}>More games</Title>
                            <Text c="dimmed">
                                Schedule game days from the next available date
                                through to the end of the booking year.
                            </Text>
                        </Stack>
                        <Group
                            justify="space-between"
                            mb="lg"
                        >
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
                        <Table.ScrollContainer
                            minWidth={480}
                            scrollAreaProps={{ type: 'auto' }}
                        >
                            <Table
                                highlightOnHover
                                withTableBorder
                            >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Game</Table.Th>
                                        <Table.Th>Comment</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {groupedRows.map((group, groupIndex) => (
                                        <Fragment
                                            key={`${group.label}-${groupIndex}`}
                                        >
                                            <Table.Tr>
                                                <Table.Th
                                                    colSpan={3}
                                                    bg="var(--mantine-color-gray-light)"
                                                    py="xs"
                                                    style={
                                                        groupIndex > 0
                                                            ? {
                                                                  borderTop:
                                                                      '2px solid var(--mantine-color-gray-4)',
                                                              }
                                                            : undefined
                                                    }
                                                >
                                                    <Text
                                                        fw={700}
                                                        tt="uppercase"
                                                        fz="sm"
                                                        lts={0.5}
                                                        c="dimmed"
                                                    >
                                                        {group.label}
                                                    </Text>
                                                </Table.Th>
                                            </Table.Tr>
                                            {group.rows.map(
                                                ({ row, index }) => {
                                                    return (
                                                        <Table.Tr
                                                            key={row.date}
                                                        >
                                                            <Table.Td>
                                                                <Text fw={500}>
                                                                    {row.date}
                                                                </Text>
                                                            </Table.Td>
                                                            <Table.Td>
                                                                <Checkbox
                                                                    aria-label={`Game scheduled for ${row.date}`}
                                                                    {...form.getInputProps(
                                                                        `rows.${index}.game`,
                                                                        {
                                                                            type: 'checkbox',
                                                                        },
                                                                    )}
                                                                />
                                                            </Table.Td>
                                                            <Table.Td>
                                                                <TextInput
                                                                    aria-label={`Comment for ${row.date}`}
                                                                    placeholder="Optional note"
                                                                    {...form.getInputProps(
                                                                        `rows.${index}.comment`,
                                                                    )}
                                                                />
                                                            </Table.Td>
                                                        </Table.Tr>
                                                    );
                                                },
                                            )}
                                        </Fragment>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>

                        <Button
                            type="submit"
                            w={{
                                base: '100%',
                                [actionsBreakpoint]: 'fit-content',
                            }}
                            loading={submitting}
                        >
                            Create game days
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
};

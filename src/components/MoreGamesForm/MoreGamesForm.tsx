'use client';

import {
    Box,
    Button,
    Checkbox,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Fragment } from 'react';

import { createMoreGameDays } from '@/actions/createMoreGameDays';
import { config } from '@/lib/config';
import { CreateMoreGameDaysInput, CreateMoreGameDaysSchema } from '@/types/CreateMoreGameDaysInput';

export interface Props {
    rows: CreateMoreGameDaysInput['rows'];
}

export const MoreGamesForm: React.FC<Props> = ({ rows }) => {
    const form = useForm<CreateMoreGameDaysInput>({
        initialValues: {
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
            await createMoreGameDays(values);

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
            console.error('Failed to create game days:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
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
        <Box
            component="form"
            onSubmit={form.onSubmit(handleSubmit)}
            data-testid="moregames-form"
        >
            <Table
                highlightOnHover
                withTableBorder
                data-testid="moregames-table"
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
                                <TableTh colSpan={3} data-testid="moregames-month">
                                    <Text fw={600} c="gray">{group.label}</Text>
                                </TableTh>
                            </TableTr>
                            {group.rows.map(({ row, index }) => {
                                return (
                                    <TableTr key={row.date} data-testid="moregames-row">
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

            <Button type="submit" mt="md" data-testid="moregames-submit">
                Create game days
            </Button>
        </Box>
    );
};

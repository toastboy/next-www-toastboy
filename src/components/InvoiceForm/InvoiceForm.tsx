'use client';

import {
    Anchor,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    NumberInput,
    Paper,
    Stack,
    Table,
    TableTbody,
    TableTd,
    TableTh,
    TableThead,
    TableTr,
    Text,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import z from 'zod';

import { config } from '@/lib/config';
import { toPounds } from '@/lib/money';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { RecordHallHireProxy } from '@/types/actions/RecordHallHire';
import type { UpdateInvoiceGameDaysProxy } from '@/types/actions/UpdateInvoiceGameDays';
import { UpdateInvoiceGameDaysInputSchema } from '@/types/actions/UpdateInvoiceGameDays';

const monthNameFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long' });
const getMonthName = (year: number, month: number) =>
    monthNameFormatter.format(new Date(year, month - 1, 1));

const RecordHallHireFormSchema = z.object({
    amountPounds: z.number().positive(),
});

type RecordHallHireFormValues = z.infer<typeof RecordHallHireFormSchema>;

interface GameDayRow {
    id: number;
    date: string;
    gameScheduled: boolean;
    hallCost: number;
}

type UpdateGameDaysFormValues = z.infer<typeof UpdateInvoiceGameDaysInputSchema>;

interface InvoiceFormProps {
    year: number;
    month: number;
    gameDays: GameDayRow[];
    onUpdateGameDays: UpdateInvoiceGameDaysProxy;
    onRecordHallHire: RecordHallHireProxy;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

export const InvoiceForm = ({
    year,
    month,
    gameDays,
    onUpdateGameDays,
    onRecordHallHire,
}: InvoiceFormProps) => {
    const router = useRouter();

    const gameDaysForm = useForm<UpdateGameDaysFormValues>({
        initialValues: {
            gameDays: gameDays.map((gd) => ({ id: gd.id, gameScheduled: gd.gameScheduled })),
        },
        validate: zod4Resolver(UpdateInvoiceGameDaysInputSchema),
    });

    const hallHireForm = useForm<RecordHallHireFormValues>({
        initialValues: {
            amountPounds: gameDays.reduce(
                (sum, gd) => (gd.gameScheduled ? sum + toPounds(gd.hallCost ?? 0) : sum),
                0,
            ),
        },
        validate: zod4Resolver(RecordHallHireFormSchema),
        validateInputOnBlur: true,
    });

    const navigateMonth = (delta: number) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        router.push(`/footy/admin/invoice?year=${newYear}&month=${newMonth}`);
    };

    const handleUpdateGameDays = async (values: UpdateGameDaysFormValues) => {
        const id = notifications.show({
            loading: true,
            title: 'Saving game days',
            message: 'Updating game day statuses...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await onUpdateGameDays(values);

            notifications.update({
                id,
                color: 'teal',
                title: 'Saved',
                message: 'Game days updated successfully.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'InvoiceForm',
                action: 'updateGameDays',
                route: '/footy/admin/invoice',
            });
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to update game days.',
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const handleRecordHallHire = async (
        values: RecordHallHireFormValues,
        gameDays: GameDayRow[],
    ) => {

        const notificationId = 'hall-hire';

        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Recording invoice',
            message: `Recording £${values.amountPounds.toFixed(2)} hall hire...`,
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await Promise.all(
                gameDays
                    .filter((gd) => gd.gameScheduled && gd.hallCost > 0)
                    .map((gd) =>
                        onRecordHallHire({
                            amountPence: gd.hallCost,
                            gameDayId: gd.id,
                            note: `Kelsey Kerridge invoice ${getMonthName(year, month)} ${year}`,
                        }),
                    ),
            );

            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Invoice recorded',
                message: `Hall hire of £${values.amountPounds.toFixed(2)} recorded.`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });

            hallHireForm.setFieldValue('amountPounds', 0);
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'InvoiceForm',
                action: 'recordHallHire',
                route: '/footy/admin/invoice',
            });
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to record invoice.',
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    return (
        <Stack gap="xl">
            <Title order={2}>Invoice Check</Title>

            <Group>
                <Button
                    variant="subtle"
                    leftSection={<IconChevronLeft size={16} />}
                    onClick={() => navigateMonth(-1)}
                >
                    {getMonthName(year, month - 1)}
                </Button>
                <Title order={3} style={{ flex: 1, textAlign: 'center' }}>
                    {getMonthName(year, month)} {year}
                </Title>
                <Button
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                    onClick={() => navigateMonth(1)}
                >
                    {getMonthName(year, month + 1)}
                </Button>
            </Group>

            <Stack gap="sm">
                <Title order={4}>Game Days</Title>
                {gameDays.length === 0 ? (
                    <Text c="dimmed">No game days found for this month.</Text>
                ) : (
                    <Box
                        component="form"
                        onSubmit={gameDaysForm.onSubmit(handleUpdateGameDays)}
                    >
                        <Table withTableBorder highlightOnHover>
                            <TableThead>
                                <TableTr>
                                    <TableTh>Date</TableTh>
                                    <TableTh>Game Scheduled</TableTh>
                                </TableTr>
                            </TableThead>
                            <TableTbody>
                                {gameDays.map((gd, index) => (
                                    <TableTr key={gd.id}>
                                        <TableTd>
                                            <Text>{dateFormatter.format(new Date(`${gd.date}T18:00:00`))}</Text>
                                        </TableTd>
                                        <TableTd>
                                            <Checkbox
                                                aria-label={`Game scheduled for ${gd.date}`}
                                                {...gameDaysForm.getInputProps(`gameDays.${index}.gameScheduled`, { type: 'checkbox' })}
                                            />
                                        </TableTd>
                                    </TableTr>
                                ))}
                            </TableTbody>
                        </Table>
                        <Button type="submit" mt="sm">
                            Save game days
                        </Button>
                    </Box>
                )}
            </Stack>

            <Divider />

            <Stack gap="sm">
                <Title order={4}>Record Invoice</Title>
                <Text size="sm" c="dimmed">
                    Enter the amount from the Kelsey Kerridge direct debit to record it as a club expense.
                </Text>
                <Paper withBorder p="md">
                    <Box
                        component="form"
                        onSubmit={hallHireForm.onSubmit((values) => handleRecordHallHire(values, gameDays))}
                    >
                        <Stack gap="sm">
                            <NumberInput
                                label="Invoice amount"
                                prefix="£"
                                disabled
                                decimalScale={2}
                                fixedDecimalScale
                                allowNegative={false}
                                hideControls
                                min={0.01}
                                {...hallHireForm.getInputProps('amountPounds')}
                            />
                            <Group>
                                <Button type="submit">
                                    Record invoice
                                </Button>
                            </Group>
                        </Stack>
                    </Box>
                </Paper>
                <Text size="xs" c="dimmed">
                    Current club balance can be viewed on the{' '}
                    <Anchor href="/footy/books">Books</Anchor> page.
                </Text>
            </Stack>
        </Stack>
    );
};

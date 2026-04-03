'use client';

import {
    Anchor,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    NumberInput,
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
import { formatDate, getFullMonthName } from '@/lib/dates';
import { toPounds } from '@/lib/money';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { RecordHallHireProxy } from '@/types/actions/RecordHallHire';
import type { UpdateInvoiceGameDaysProxy } from '@/types/actions/UpdateInvoiceGameDays';

const InvoiceFormSchema = z.object({
    gameDays: z.array(z.object({
        id: z.number().int().positive(),
        gameScheduled: z.boolean(),
        hallCostPounds: z.number().min(0),
    })),
});

type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>;

interface GameDayRow {
    id: number;
    date: string;
    gameScheduled: boolean;
    hallCost: number;
}

interface InvoiceFormProps {
    year: number;
    month: number;
    gameDays: GameDayRow[];
    onUpdateGameDays: UpdateInvoiceGameDaysProxy;
    onRecordHallHire: RecordHallHireProxy;
}

export const InvoiceForm = ({
    year,
    month,
    gameDays,
    onUpdateGameDays,
    onRecordHallHire,
}: InvoiceFormProps) => {
    const router = useRouter();

    const form = useForm<InvoiceFormValues>({
        initialValues: {
            gameDays: gameDays.map((gd) => ({
                id: gd.id,
                gameScheduled: gd.gameScheduled,
                hallCostPounds: toPounds(gd.hallCost ?? 0),
            })),
        },
        validate: zod4Resolver(InvoiceFormSchema),
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

    const handleSubmit = async (values: InvoiceFormValues) => {
        const notificationId = 'invoice-form';

        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Saving invoice',
            message: 'Saving game days and recording hall hire...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await onUpdateGameDays({
                gameDays: values.gameDays.map((gd) => ({
                    id: gd.id,
                    gameScheduled: gd.gameScheduled,
                })),
            });

            await Promise.all(
                values.gameDays
                    .filter((gd) => gd.gameScheduled && gd.hallCostPounds > 0)
                    .map((gd) =>
                        onRecordHallHire({
                            amountPence: Math.round(gd.hallCostPounds * 100),
                            gameDayId: gd.id,
                            note: `Kelsey Kerridge invoice ${getFullMonthName(year, month)} ${year}`,
                        }),
                    ),
            );

            const total = values.gameDays
                .filter((gd) => gd.gameScheduled)
                .reduce((sum, gd) => sum + gd.hallCostPounds, 0);

            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Invoice recorded',
                message: `Hall hire of £${total.toFixed(2)} recorded.`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (err) {
            captureUnexpectedError(err, {
                layer: 'client',
                component: 'InvoiceForm',
                action: 'submit',
                route: '/footy/admin/invoice',
            });
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: err instanceof Error ? err.message : 'Failed to save invoice.',
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    const total = form.values.gameDays
        .filter((gd) => gd.gameScheduled)
        .reduce((sum, gd) => sum + (gd.hallCostPounds || 0), 0);

    return (
        <Stack gap="xl" w="60%" mx="auto" my="xl">
            <Title order={2}>Invoice Check</Title>

            <Group>
                <Button
                    variant="subtle"
                    leftSection={<IconChevronLeft size={16} />}
                    onClick={() => navigateMonth(-1)}
                >
                    {getFullMonthName(year, month - 1)}
                </Button>
                <Title order={3} style={{ flex: 1, textAlign: 'center' }}>
                    {getFullMonthName(year, month)} {year}
                </Title>
                <Button
                    variant="subtle"
                    rightSection={<IconChevronRight size={16} />}
                    onClick={() => navigateMonth(1)}
                >
                    {getFullMonthName(year, month + 1)}
                </Button>
            </Group>

            {gameDays.length === 0 ? (
                <Text c="dimmed">No game days found for this month.</Text>
            ) : (
                <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="sm">
                        <Table withTableBorder highlightOnHover>
                            <TableThead>
                                <TableTr>
                                    <TableTh>Date</TableTh>
                                    <TableTh>Game</TableTh>
                                    <TableTh>Hall Cost</TableTh>
                                </TableTr>
                            </TableThead>
                            <TableTbody>
                                {gameDays.map((gd, index) => (
                                    <TableTr key={gd.id}>
                                        <TableTd>
                                            <Text>{formatDate(gd.date)}</Text>
                                        </TableTd>
                                        <TableTd>
                                            <Checkbox
                                                aria-label={`Game scheduled for ${formatDate(gd.date)}`}
                                                {...form.getInputProps(`gameDays.${index}.gameScheduled`, { type: 'checkbox' })}
                                            />
                                        </TableTd>
                                        <TableTd>
                                            <NumberInput
                                                aria-label={`Hall cost for ${formatDate(gd.date)}`}
                                                prefix="£"
                                                decimalScale={2}
                                                disabled
                                                fixedDecimalScale
                                                allowNegative={false}
                                                hideControls
                                                min={0}
                                                w={"8em"}
                                                {...form.getInputProps(`gameDays.${index}.hallCostPounds`)}
                                            />
                                        </TableTd>
                                    </TableTr>
                                ))}
                            </TableTbody>
                        </Table>

                        <Divider />

                        <Group justify="space-between" align="center">
                            <Text fw={600}>Total: £{total.toFixed(2)}</Text>
                            <Button type="submit">Record invoice</Button>
                        </Group>

                        <Text size="xs" c="dimmed">
                            Current club balance can be viewed on the{' '}
                            <Anchor href="/footy/books">Books</Anchor> page.
                        </Text>
                    </Stack>
                </Box>
            )}
        </Stack>
    );
};

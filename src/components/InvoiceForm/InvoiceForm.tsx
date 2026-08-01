'use client';

import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Group,
    NumberInput,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    useForm,
} from '@mantine/form';
import {
    notifications,
} from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import z from 'zod';

import { config } from '@/lib/config';
import { formatDate, getFullMonthName, getShortMonthName } from '@/lib/dates';
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

// Breakpoint at which the submit button switches from a full-width mobile
// touch target to an inline fit-content button.
const actionsBreakpoint = 'sm';

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
                /* c8 ignore next — hallCost is a non-nullable DB column; the ?? 0 is a runtime safety net only */
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
        <Paper
            maw="30rem"
            mx="auto"
            my="lg"
        >
            <Stack
                gap="md"
            >
                <Title order={2}>Invoice Check</Title>

                <Group justify="space-between" wrap="wrap">
                    <Button
                        variant="subtle"
                        leftSection={<IconChevronLeft size={16} />}
                        onClick={() => navigateMonth(-1)}
                    >
                        {getShortMonthName(year, month - 1)}
                    </Button>
                    <Title
                        order={3}
                        flex={1}
                        ta="center"
                    >
                        {getShortMonthName(year, month)} {year}
                    </Title>
                    <Button
                        variant="subtle"
                        rightSection={<IconChevronRight size={16} />}
                        onClick={() => navigateMonth(1)}
                    >
                        {getShortMonthName(year, month + 1)}
                    </Button>
                </Group>

                {gameDays.length === 0 ? (
                    <Text
                        c="dimmed"
                    >
                        No game days found for this month.
                    </Text>
                ) : (
                    <Box
                        component="form"
                        onSubmit={form.onSubmit(handleSubmit)}
                    >
                        <Stack gap="sm">
                            {gameDays.map((gd, index) => (
                                <Flex
                                    key={gd.id}
                                    wrap="wrap"
                                    align="center"
                                    gap="sm"
                                    bd="1px solid var(--mantine-color-gray-3)"
                                    p="sm"
                                    bdrs="sm"
                                >
                                    <Text
                                        fw={600}
                                        miw="7rem"
                                    >
                                        {formatDate(gd.date)}
                                    </Text>
                                    <Checkbox
                                        label="Game"
                                        aria-label={`Game scheduled for ${formatDate(gd.date)}`}
                                        {...form.getInputProps(`gameDays.${index}.gameScheduled`, { type: 'checkbox' })}
                                    />
                                    <NumberInput
                                        aria-label={`Hall cost for ${formatDate(gd.date)}`}
                                        prefix="£"
                                        decimalScale={2}
                                        disabled
                                        fixedDecimalScale
                                        allowNegative={false}
                                        hideControls
                                        min={0}
                                        w="6rem"
                                        ml="auto"
                                        {...form.getInputProps(`gameDays.${index}.hallCostPounds`)}
                                    />
                                </Flex>
                            ))}

                            <Divider />

                            <Group justify="space-between" align="center" wrap="wrap">
                                <Text fw={600}>Total: £{total.toFixed(2)}</Text>
                                <Button type="submit" w={{ base: '100%', [actionsBreakpoint]: 'fit-content' }}>
                                    Record invoice
                                </Button>
                            </Group>
                        </Stack>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
};

'use client';

import {
    Anchor,
    Box,
    Button,
    Checkbox,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import z from 'zod';

import { GameDayLink } from '@/components/GameDayLink/GameDayLink';
import { config } from '@/lib/config';
import {
    formatCurrency,
    formatCurrencySigned,
    getBalanceColor,
} from '@/lib/money';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { PayDebtInput, PayDebtProxy } from '@/types/actions/PayDebt';
import type { PlayerDebtsType } from '@/types/DebtType';

export interface MoneyFormProps {
    playerDebts: PlayerDebtsType[];
    payDebt: PayDebtProxy;
}

const PayDebtFormSchema = z.object({
    checkedIds: z.array(z.number().int()).min(1),
});

type PayDebtFormValues = z.infer<typeof PayDebtFormSchema>;

interface DebtRowProps {
    row: PlayerDebtsType;
    payDebt: PayDebtProxy;
    submittingPlayerId: number | null;
    setSubmittingPlayerId: React.Dispatch<React.SetStateAction<number | null>>;
}

const DebtRow = ({
    row,
    payDebt,
    submittingPlayerId,
    setSubmittingPlayerId,
}: DebtRowProps) => {
    const router = useRouter();
    const totalDebt = row.debts.reduce((sum, d) => sum + d.amount, 0);

    const form = useForm<PayDebtFormValues>({
        initialValues: {
            checkedIds: row.debts.map((d) => d.gameDay.id),
        },
        validate: zod4Resolver(PayDebtFormSchema),
    });

    const checkedDebts = row.debts.filter((d) => form.values.checkedIds.includes(d.gameDay.id));
    const totalAmount = checkedDebts.reduce((sum, d) => sum + d.amount, 0);

    const toggleDebt = (gameDayId: number) => {
        const current = form.values.checkedIds;
        form.setFieldValue(
            'checkedIds',
            current.includes(gameDayId) ?
                current.filter((id) => id !== gameDayId) :
                [...current, gameDayId],
        );
    };

    const handlePay = async (values: PayDebtFormValues) => {
        const notificationId = `money-paid-${row.player.id}`;
        const gameDayIds = values.checkedIds;
        const amount = row.debts
            .filter((d) => gameDayIds.includes(d.gameDay.id))
            .reduce((sum, d) => sum + d.amount, 0);

        const payload: PayDebtInput = {
            playerId: row.player.id,
            amount,
            gameDayIds,
        };

        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Recording payment',
            message: `Recording ${formatCurrency(amount)} for ${row.player.name ?? 'player'} across ${gameDayIds.length} game(s)...`,
            autoClose: false,
            withCloseButton: false,
        });

        setSubmittingPlayerId(row.player.id);
        try {
            const result = await payDebt(payload);

            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Payment recorded',
                message: `Created ${result.transactionIds.length} transaction(s). New balance: ${formatCurrencySigned(result.resultingBalance)}.`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });

            router.refresh();
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                component: 'MoneyForm',
                action: 'payDebt',
                route: '/footy/admin/money',
                extra: {
                    playerId: row.player.id,
                    amount,
                    gameDayCount: gameDayIds.length,
                },
            });
            const message = error instanceof Error ? error.message : 'Failed to record payment';
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        } finally {
            setSubmittingPlayerId(null);
        }
    };

    return (
        <Paper withBorder p="sm">
            <Box component="form" onSubmit={form.onSubmit(handlePay)}>
                <Stack gap="sm">
                    <Group wrap="nowrap">
                        <Anchor href={`/footy/player/${row.player.id}`}>
                            <Image
                                w={48}
                                h={48}
                                radius="xl"
                                src={`/api/footy/player/${row.player.id}/mugshot`}
                                alt={row.player.name ?? `Player ${row.player.id}`}
                            />
                        </Anchor>
                        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                            <Anchor href={`/footy/player/${row.player.id}`}>
                                {row.player.name ?? `Player ${row.player.id}`}
                            </Anchor>
                            <Text size="sm" c={getBalanceColor(-totalDebt)}>
                                Total debt: {formatCurrencySigned(-totalDebt)} ({row.debts.length} game{row.debts.length === 1 ? '' : 's'})
                            </Text>
                        </Stack>
                    </Group>

                    {row.debts.length > 0 && (
                        <Stack gap="xs">
                            {row.debts.map((debt) => (
                                <Checkbox
                                    key={debt.gameDay.id}
                                    checked={form.values.checkedIds.includes(debt.gameDay.id)}
                                    onChange={() => toggleDebt(debt.gameDay.id)}
                                    label={
                                        <Group gap="xs">
                                            <GameDayLink gameDay={debt.gameDay} />
                                            <Text size="sm">{formatCurrency(debt.amount)}</Text>
                                        </Group>
                                    }
                                />
                            ))}
                        </Stack>
                    )}

                    <Group wrap="nowrap" justify="flex-end">
                        <Text size="sm" fw={500}>
                            {formatCurrency(totalAmount)}
                        </Text>
                        <Button
                            type="submit"
                            disabled={form.values.checkedIds.length === 0 || submittingPlayerId === row.player.id}
                            loading={submittingPlayerId === row.player.id}
                        >
                            Paid
                        </Button>
                    </Group>
                </Stack>
            </Box>
        </Paper>
    );
};

export const MoneyForm = ({
    playerDebts,
    payDebt,
}: MoneyFormProps) => {
    const [submittingPlayerId, setSubmittingPlayerId] = useState<number | null>(null);

    return (
        <Stack gap="md">
            <Stack gap="xs">
                <Title order={1}>Unpaid Player Charges</Title>
                {playerDebts.map((row) => (
                    <DebtRow
                        key={row.player.id}
                        row={row}
                        payDebt={payDebt}
                        submittingPlayerId={submittingPlayerId}
                        setSubmittingPlayerId={setSubmittingPlayerId}
                    />
                ))}
            </Stack>
        </Stack>
    );
};

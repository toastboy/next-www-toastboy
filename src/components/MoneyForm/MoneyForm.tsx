'use client';

import {
    Anchor,
    Box,
    Button,
    Divider,
    Group,
    Image,
    NumberInput,
    Paper,
    Stack,
    Switch,
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

import { config } from '@/lib/config';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { PayDebtInput, PayDebtProxy } from '@/types/actions/PayDebt';
import type { ClubBalanceType, PlayerBalanceType } from '@/types/DebtType';

export interface MoneyFormProps {
    playerBalances: PlayerBalanceType[];
    clubBalance: ClubBalanceType;
    total: number;
    positiveTotal: number;
    negativeTotal: number;
    payDebt: PayDebtProxy;
}

const toPounds = (amount: number) => amount / 100;
const fromPounds = (amount: number) => Math.round(amount * 100);
const formatAmount = (amount: number) => toPounds(amount).toFixed(2);
const formatCurrency = (amount: number) => `£${formatAmount(amount)}`;
const formatCurrencySigned = (amount: number) =>
    `${amount < 0 ? '-' : ''}${formatCurrency(Math.abs(amount))}`;

const getBalanceColor = (amount: number) => {
    if (amount < 0) return 'red';
    if (amount > 0) return 'teal';
    return 'dimmed';
};

const PayDebtFormSchema = z.object({
    amountPounds: z.number().positive(),
});

type PayDebtFormValues = z.infer<typeof PayDebtFormSchema>;

interface BalanceRowProps {
    row: PlayerBalanceType;
    payDebt: PayDebtProxy;
    submittingPlayerId: number | null;
    setSubmittingPlayerId: React.Dispatch<React.SetStateAction<number | null>>;
}

const BalanceRow: React.FC<BalanceRowProps> = ({
    row,
    payDebt,
    submittingPlayerId,
    setSubmittingPlayerId,
}) => {
    const router = useRouter();
    const form = useForm<PayDebtFormValues>({
        initialValues: {
            amountPounds: row.amount < 0 ? toPounds(Math.abs(row.amount)) : 0,
        },
        validate: zod4Resolver(PayDebtFormSchema),
        validateInputOnBlur: true,
    });

    const handlePay = async (values: PayDebtFormValues) => {
        const notificationId = `money-paid-${row.playerId}`;
        const amount = fromPounds(values.amountPounds);
        const payload: PayDebtInput = {
            playerId: row.playerId,
            amount,
        };

        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Recording payment',
            message: `Recording ${formatCurrency(amount)} for ${row.playerName}...`,
            autoClose: false,
            withCloseButton: false,
        });

        setSubmittingPlayerId(row.playerId);
        try {
            const result = await payDebt(payload);

            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Payment recorded',
                message: `Transaction #${result.transactionId} saved. New balance: ${formatCurrencySigned(result.resultingBalance)}.`,
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
                    playerId: row.playerId,
                    amount,
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
                <Group wrap="nowrap">
                    <Anchor href={`/footy/player/${row.playerId}`}>
                        <Image
                            w={48}
                            h={48}
                            radius="xl"
                            src={`/api/footy/player/${row.playerId}/mugshot`}
                            alt={row.playerName}
                        />
                    </Anchor>
                    <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                        <Anchor href={`/footy/player/${row.playerId}`}>
                            {row.playerName}
                        </Anchor>
                        <Text size="sm" c={getBalanceColor(row.amount)}>
                            Balance: {formatCurrencySigned(row.amount)}
                        </Text>
                    </Stack>
                    <NumberInput
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        hideControls
                        aria-label={`Amount paid by ${row.playerName}`}
                        w={120}
                        {...form.getInputProps('amountPounds')}
                    />
                    <Button
                        type="submit"
                        loading={submittingPlayerId === row.playerId}
                    >
                        Paid
                    </Button>
                </Group>
            </Box>
        </Paper>
    );
};

export const MoneyForm: React.FC<MoneyFormProps> = ({
    playerBalances,
    clubBalance,
    total,
    positiveTotal,
    negativeTotal,
    payDebt,
}) => {
    const [submittingPlayerId, setSubmittingPlayerId] = useState<number | null>(null);
    const [showZeroBalances, setShowZeroBalances] = useState(false);

    const sortPlayerBalances = (balances: PlayerBalanceType[]) =>
        balances.sort((a, b) => {
            const gameDayComparison = (b.maxGameDayId ?? 0) - (a.maxGameDayId ?? 0);
            if (gameDayComparison !== 0) return gameDayComparison;
            return a.playerName.localeCompare(b.playerName);
        });

    const visiblePlayerBalances = showZeroBalances ?
        sortPlayerBalances(playerBalances) :
        sortPlayerBalances(playerBalances).filter((row) => row.amount !== 0);

    const hasAnyBalance = visiblePlayerBalances.length > 0 || clubBalance.amount !== 0;

    return (
        <Stack gap="md">
            <Title order={2}>Money Balances</Title>
            {playerBalances.length > 0 ? (
                <Switch
                    checked={showZeroBalances}
                    onChange={(event) => setShowZeroBalances(event.currentTarget.checked)}
                    label="Show players with zero balance"
                />
            ) : null}
            {hasAnyBalance ? (
                <>
                    {visiblePlayerBalances.length > 0 ? (
                        <>
                            <Stack gap="xs">
                                <Title order={3}>Player Balances</Title>
                                {visiblePlayerBalances.map((row) => (
                                    <BalanceRow
                                        key={row.playerId}
                                        row={row}
                                        payDebt={payDebt}
                                        submittingPlayerId={submittingPlayerId}
                                        setSubmittingPlayerId={setSubmittingPlayerId}
                                    />
                                ))}
                            </Stack>
                            <Divider />
                        </>
                    ) : null}
                    <Paper withBorder p="sm">
                        <Group justify="space-between">
                            <Text fw={700}>{clubBalance.playerName} Balance</Text>
                            <Text fw={700} c={getBalanceColor(clubBalance.amount)}>
                                {formatCurrencySigned(clubBalance.amount)}
                            </Text>
                        </Group>
                    </Paper>
                    <Divider />
                    <Text fw={700}>Positive total: {formatCurrency(positiveTotal)}</Text>
                    <Text fw={700}>Negative total: {formatCurrencySigned(negativeTotal)}</Text>
                    <Text fw={700}>Net total: {formatCurrencySigned(total)}</Text>
                </>
            ) : (
                <Text fw={700}>No balances recorded yet</Text>
            )}
        </Stack>
    );
};

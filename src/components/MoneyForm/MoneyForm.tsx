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

import { config } from '@/lib/config';
import type { PayDebtInput, PayDebtProxy } from '@/types/actions/PayDebt';
import { PayDebtInputSchema } from '@/types/actions/PayDebt';
import type { ClubBalanceType, PlayerBalanceType } from '@/types/DebtType';

export interface MoneyFormProps {
    playerBalances: PlayerBalanceType[];
    clubBalance: ClubBalanceType;
    total: number;
    positiveTotal: number;
    negativeTotal: number;
    payDebt: PayDebtProxy;
}

const formatAmount = (amount: number) => amount.toFixed(2);
const formatCurrency = (amount: number) => `£${formatAmount(amount)}`;
const formatCurrencySigned = (amount: number) => `${amount < 0 ? '-' : ''}${formatCurrency(Math.abs(amount))}`;

const getBalanceColor = (amount: number) => {
    if (amount < 0) return 'red';
    if (amount > 0) return 'teal';
    return 'dimmed';
};

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
    const form = useForm<PayDebtInput>({
        initialValues: {
            playerId: row.playerId,
            amount: row.amount < 0 ? Math.abs(row.amount) : 0,
        },
        validate: zod4Resolver(PayDebtInputSchema),
        validateInputOnBlur: true,
    });

    const handlePay = async (values: PayDebtInput) => {
        const notificationId = `money-paid-${row.playerId}`;
        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Recording payment',
            message: `Recording ${formatCurrency(values.amount)} for ${row.playerName}...`,
            autoClose: false,
            withCloseButton: false,
        });

        setSubmittingPlayerId(row.playerId);
        try {
            const result = await payDebt(values);

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
                        {...form.getInputProps('amount')}
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

    const visiblePlayerBalances = showZeroBalances ?
        playerBalances :
        playerBalances.filter((row) => row.amount !== 0);

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

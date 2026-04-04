'use client';

import {
    Anchor,
    Box,
    Button,
    Group,
    Image,
    List,
    NumberInput,
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

import { config } from '@/lib/config';
import {
    formatCurrency,
    formatCurrencySigned,
    fromPounds,
    getBalanceColor,
    toPounds,
} from '@/lib/money';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { PayDebtInput, PayDebtProxy } from '@/types/actions/PayDebt';
import type { PlayerDebtsType } from '@/types/DebtType';

export interface MoneyFormProps {
    playerDebts: PlayerDebtsType[];
    payDebt: PayDebtProxy;
}

const PayDebtFormSchema = z.object({
    amountPounds: z.number().positive(),
});

type PayDebtFormValues = z.infer<typeof PayDebtFormSchema>;

interface DebtRowProps {
    row: PlayerDebtsType;
    payDebt: PayDebtProxy;
    submittingPlayerId: number | null;
    setSubmittingPlayerId: React.Dispatch<React.SetStateAction<number | null>>;
}

/**
 * Calculates the total debt amount for a player.
 *
 * @param debts - Array of unpaid charges
 * @returns The sum of all debt amounts in pence
 */
const calculateTotalDebt = (debts: { amount: number }[]): number =>
    debts.reduce((sum, debt) => sum + debt.amount, 0);

const DebtRow = ({
    row,
    payDebt,
    submittingPlayerId,
    setSubmittingPlayerId,
}: DebtRowProps) => {
    const router = useRouter();
    const totalDebt = calculateTotalDebt(row.debts);

    const form = useForm<PayDebtFormValues>({
        initialValues: {
            amountPounds: toPounds(totalDebt),
        },
        validate: zod4Resolver(PayDebtFormSchema),
        validateInputOnBlur: true,
    });

    const handlePay = async (values: PayDebtFormValues) => {
        const notificationId = `money-paid-${row.playerId}`;
        const amount = fromPounds(values.amountPounds);
        const gameDayIds = row.debts.map((debt) => debt.gameDayId);

        const payload: PayDebtInput = {
            playerId: row.playerId,
            amount,
            gameDayIds,
        };

        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Recording payment',
            message: `Recording ${formatCurrency(amount)} for ${row.playerName} across ${gameDayIds.length} game(s)...`,
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
                    playerId: row.playerId,
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
                            <Text size="sm" c={getBalanceColor(-totalDebt)}>
                                Total debt: {formatCurrencySigned(-totalDebt)} ({row.debts.length} game{row.debts.length === 1 ? '' : 's'})
                            </Text>
                        </Stack>
                    </Group>

                    {/* Display list of unpaid charges */}
                    {row.debts.length > 0 && (
                        <List size="sm" withPadding>
                            {row.debts.map((debt) => (
                                <List.Item key={debt.gameDayId}>
                                    Game {debt.gameDayId}: {formatCurrency(debt.amount)}
                                </List.Item>
                            ))}
                        </List>
                    )}

                    {/* Payment input and button */}
                    <Group wrap="nowrap" justify="flex-end">
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
                        key={row.playerId}
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

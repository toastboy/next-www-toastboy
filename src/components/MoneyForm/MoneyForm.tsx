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
import type { DebtType } from '@/types/DebtType';

export interface MoneyFormProps {
    currentDebts: DebtType[];
    historicDebts: DebtType[];
    total: number;
    payDebt: PayDebtProxy;
}

const formatAmount = (amount: number) => amount.toFixed(2);
const formatCurrency = (amount: number) => `£${formatAmount(amount)}`;

interface DebtRowProps {
    row: DebtType;
    payDebt: PayDebtProxy;
    submittingPlayerId: number | null;
    setSubmittingPlayerId: React.Dispatch<React.SetStateAction<number | null>>;
}

const DebtRow: React.FC<DebtRowProps> = ({
    row,
    payDebt,
    submittingPlayerId,
    setSubmittingPlayerId,
}) => {
    const router = useRouter();
    const form = useForm<PayDebtInput>({
        initialValues: {
            playerId: row.playerId,
            amount: row.amount,
        },
        validate: zod4Resolver(PayDebtInputSchema),
        validateInputOnBlur: true,
    });

    const handlePay = async (values: PayDebtInput) => {
        const notificationId = `money-paid-${row.playerId}`;
        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Applying payment',
            message: `Applying ${formatCurrency(values.amount)} for ${row.playerName}...`,
            autoClose: false,
            withCloseButton: false,
        });

        setSubmittingPlayerId(row.playerId);
        try {
            const result = await payDebt(values);

            if (result.gamesMarkedPaid === 0) {
                notifications.update({
                    id: notificationId,
                    color: 'yellow',
                    title: 'No games paid',
                    message: `${row.playerName} has no eligible unpaid games for that amount.`,
                    loading: false,
                    autoClose: config.notificationAutoClose,
                });
            } else {
                const gameWord = result.gamesMarkedPaid === 1 ? 'game' : 'games';
                const remaining = result.remainingAmount > 0 ?
                    ` ${formatCurrency(result.remainingAmount)} remains unapplied.` :
                    '';
                notifications.update({
                    id: notificationId,
                    color: 'teal',
                    title: 'Payment recorded',
                    message: `${result.gamesMarkedPaid} ${gameWord} marked paid.${remaining}`,
                    icon: <IconCheck size={config.notificationIconSize} />,
                    loading: false,
                    autoClose: config.notificationAutoClose,
                });
            }

            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to apply payment';
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
                        <Text size="sm" c="dimmed">
                            Owes {formatCurrency(row.amount)}
                        </Text>
                    </Stack>
                    <NumberInput
                        min={0.01}
                        decimalScale={2}
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
    currentDebts,
    historicDebts,
    total,
    payDebt,
}) => {
    const [submittingPlayerId, setSubmittingPlayerId] = useState<number | null>(null);

    const renderRows = (title: string, rows: DebtType[]) => {
        if (rows.length === 0) return null;

        return (
            <Stack gap="xs">
                <Title order={3}>{title}</Title>
                {rows.map((row) => (
                    <DebtRow
                        key={`${row.playerId}-${row.amount}`}
                        row={row}
                        payDebt={payDebt}
                        submittingPlayerId={submittingPlayerId}
                        setSubmittingPlayerId={setSubmittingPlayerId}
                    />
                ))}
            </Stack>
        );
    };

    return (
        <Stack gap="md">
            <Title order={2}>Subs Not Paid</Title>
            {total > 0 ? (
                <>
                    {renderRows('Current Debts', currentDebts)}
                    {currentDebts.length > 0 && historicDebts.length > 0 ? <Divider /> : null}
                    {renderRows('Historic Debts', historicDebts)}
                    <Divider />
                    <Text fw={700}>Total: {formatCurrency(total)}</Text>
                </>
            ) : (
                <Text fw={700}>Stone me! Nobody owes money</Text>
            )}
        </Stack>
    );
};

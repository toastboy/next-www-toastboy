'use client';

import { Box, Button, Group, Paper, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import { config } from '@/lib/config';
import type { SetGameResultProxy, SetGameWinner } from '@/types/actions/SetGameResult';

export interface GameResultFormProps {
    gameDayId: number;
    bibs: 'A' | 'B' | null;
    winners: SetGameWinner;
    setGameResult: SetGameResultProxy;
}

export const GameResultForm: React.FC<GameResultFormProps> = ({
    gameDayId,
    bibs,
    winners,
    setGameResult,
}) => {
    const router = useRouter();
    const [isSaving, { open: setSaving, close: setSaved }] = useDisclosure(false);
    const form = useForm<{
        bibs: 'A' | 'B' | 'none';
        winner: 'A' | 'B' | 'draw' | 'none';
    }>({
        initialValues: {
            bibs: bibs ?? 'none',
            winner: winners ?? 'none',
        },
    });

    const handleSave = async (values: { bibs: 'A' | 'B' | 'none'; winner: 'A' | 'B' | 'draw' | 'none' }) => {
        const notificationId = 'game-result-update';
        notifications.show({
            id: notificationId,
            loading: true,
            title: 'Updating game details',
            message: 'Saving bibs and result...',
            autoClose: false,
            withCloseButton: false,
        });

        setSaving();
        try {
            await setGameResult({
                gameDayId,
                bibs: values.bibs === 'none' ? null : values.bibs,
                winner: values.winner === 'none' ? null : values.winner,
            });

            notifications.update({
                id: notificationId,
                color: 'teal',
                title: 'Game updated',
                message: 'Bibs and result were updated.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });

            router.refresh();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update game';
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: errorMessage,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        } finally {
            setSaved();
        }
    };

    return (
        <Box component="form" onSubmit={form.onSubmit(handleSave)}>
            <Paper withBorder p="md" shadow="xs" radius="md">
                <Stack gap="sm">
                    <Group grow>
                        <Select
                            label="Bibs"
                            data={[
                                { value: 'none', label: 'Not set' },
                                { value: 'A', label: 'Team A wore bibs' },
                                { value: 'B', label: 'Team B wore bibs' },
                            ]}
                            {...form.getInputProps('bibs')}
                        />
                        <Select
                            label="Result"
                            data={[
                                { value: 'none', label: 'Not set' },
                                { value: 'A', label: 'Team A won' },
                                { value: 'draw', label: 'Draw' },
                                { value: 'B', label: 'Team B won' },
                            ]}
                            {...form.getInputProps('winner')}
                        />
                    </Group>
                    <Group justify="flex-end">
                        <Button
                            type="submit"
                            loading={isSaving}
                            disabled={!form.isDirty()}
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Box>
    );
};

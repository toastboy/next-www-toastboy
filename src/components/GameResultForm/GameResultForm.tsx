'use client';

import { Box, Button, Flex, Paper, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import { config } from '@/lib/config';
import type {
    SetGameResultProxy,
    SetGameWinner,
} from '@/types/actions/SetGameResult';

export interface GameResultFormProps {
    gameDayId: number;
    bibs: 'A' | 'B' | null;
    winners: SetGameWinner;
    setGameResult: SetGameResultProxy;
}

export const GameResultForm = ({
    gameDayId,
    bibs,
    winners,
    setGameResult,
}: GameResultFormProps) => {
    const router = useRouter();
    const [isSaving, { open: setSaving, close: setSaved }] =
        useDisclosure(false);
    const form = useForm<{
        bibs: 'A' | 'B' | 'none';
        winner: 'A' | 'B' | 'draw' | 'none';
    }>({
        initialValues: {
            bibs: bibs ?? 'none',
            winner: winners ?? 'none',
        },
    });

    const handleSave = async (values: {
        bibs: 'A' | 'B' | 'none';
        winner: 'A' | 'B' | 'draw' | 'none';
    }) => {
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

            form.resetDirty(values);
            router.refresh();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to update game';
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
        <Box
            component="form"
            onSubmit={form.onSubmit(handleSave)}
        >
            <Paper
                p="md"
                radius="md"
            >
                <Flex
                    gap="sm"
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'stretch', sm: 'flex-end' }}
                >
                    <Select
                        label="Bibs"
                        data={[
                            { value: 'none', label: 'Not set' },
                            { value: 'A', label: 'Team A' },
                            { value: 'B', label: 'Team B' },
                        ]}
                        value={form.values.bibs}
                        /* v8 ignore next -- allowDeselect={false} means value is never null */
                        onChange={(value) =>
                            form.setFieldValue('bibs', value ?? 'none')
                        }
                        allowDeselect={false}
                        miw="8rem"
                        w={{ base: '100%', sm: 'auto' }}
                    />
                    <Select
                        label="Result"
                        data={[
                            { value: 'none', label: 'Not set' },
                            { value: 'A', label: 'A won' },
                            { value: 'draw', label: 'Draw' },
                            { value: 'B', label: 'B won' },
                        ]}
                        value={form.values.winner}
                        /* v8 ignore next -- allowDeselect={false} means value is never null */
                        onChange={(value) =>
                            form.setFieldValue('winner', value ?? 'none')
                        }
                        allowDeselect={false}
                        miw="8rem"
                        w={{ base: '100%', sm: 'auto' }}
                    />
                    <Button
                        type="submit"
                        loading={isSaving}
                        disabled={!form.isDirty()}
                        w={{ base: '100%', sm: 'auto' }}
                    >
                        Save
                    </Button>
                </Flex>
            </Paper>
        </Box>
    );
};

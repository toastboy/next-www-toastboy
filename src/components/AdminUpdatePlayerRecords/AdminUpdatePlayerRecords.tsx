'use client';

import { ActionIcon, Button, Center, Container, RingProgress, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useEffect } from 'react';

import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { useRecordsProgress } from '@/lib/swr';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

export interface Props {
    onUpdatePlayerRecords: UpdatePlayerRecordsProxy;
};

export const AdminUpdatePlayerRecords: React.FC<Props> = ({ onUpdatePlayerRecords }) => {
    const { data, mutate } = useRecordsProgress();

    useEffect(() => {
        const intervalId = setInterval(() => {
            mutate().catch((err) => {
                captureUnexpectedError(err, {
                    layer: 'client',
                    component: 'AdminUpdatePlayerRecords',
                    action: 'mutateProgress',
                    route: '/footy/admin/players',
                });
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [mutate]);

    if (data?.length !== 2) return null;

    const progress = Math.floor(100 * data[0] / data[1]);

    return (
        <>
            <Container>
                <RingProgress
                    label={
                        progress === 100 ?
                            <Center>
                                <ActionIcon
                                    color="teal"
                                    variant="light"
                                    radius="xl"
                                    size="xl"
                                >
                                    <IconCheck
                                        data-testid="update-player-records-compete-icon"
                                    />
                                </ActionIcon>
                            </Center>                            :
                            <Text
                                data-testid="update-player-records-progress"
                                c="blue"
                                fw={700}
                                ta="center"
                                size="xl"
                            >
                                {progress}%
                            </Text>
                    }
                    sections={[
                        { value: progress, color: progress === 100 ? 'teal' : 'blue' },
                    ]}
                />
                <Button
                    type="button"
                    data-testid="update-player-records-button"
                    onClick={() => {
                        onUpdatePlayerRecords().catch((err) => {
                            captureUnexpectedError(err, {
                                layer: 'client',
                                component: 'AdminUpdatePlayerRecords',
                                action: 'updatePlayerRecords',
                                route: '/footy/admin/players',
                            });
                            notifications.show({
                                color: 'red',
                                title: 'Error',
                                message: toPublicMessage(err, 'Failed to update player records.'),
                            });
                        });
                    }}
                >
                    Update Player Records
                </Button>
            </Container>
        </>
    );
};

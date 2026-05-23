'use client';

import { ActionIcon, Button, Center, Container, RingProgress, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

import { SkeletonRecordsProgress } from '@/components/Skeletons/Skeletons';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { GetProgressProxy } from '@/types/actions/GetProgress';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

export interface Props {
    onUpdatePlayerRecords: UpdatePlayerRecordsProxy;
    getProgress: GetProgressProxy;
};

export const AdminUpdatePlayerRecords = ({ onUpdatePlayerRecords, getProgress }: Props) => {
    const [progress, setProgress] = useState<[number, number] | null | undefined>(undefined);
    const getProgressRef = useRef(getProgress);

    useEffect(() => {
        getProgressRef.current = getProgress;
    }, [getProgress]);

    useEffect(() => {
        const poll = () => {
            getProgressRef.current().then(setProgress).catch((err) => {
                captureUnexpectedError(err, {
                    layer: 'client',
                    component: 'AdminUpdatePlayerRecords',
                    action: 'getProgress',
                    route: '/footy/admin',
                });
            });
        };

        poll();
        const intervalId = setInterval(poll, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (progress === undefined) return <SkeletonRecordsProgress />;
    if (progress?.length !== 2) return null;

    const pct = Math.floor(100 * progress[0] / progress[1]);

    return (
        <>
            <Container>
                <RingProgress
                    label={
                        pct === 100 ?
                            <Center>
                                <ActionIcon
                                    aria-label="Progress complete"
                                    color="teal"
                                    variant="light"
                                    radius="xl"
                                    size="xl"
                                >
                                    <IconCheck />
                                </ActionIcon>
                            </Center> :
                            <Text
                                c="blue"
                                fw={700}
                                ta="center"
                                size="xl"
                            >
                                {pct}%
                            </Text>
                    }
                    sections={[
                        { value: pct, color: pct === 100 ? 'teal' : 'blue' },
                    ]}
                />
                <Button
                    type="button"
                    onClick={() => {
                        onUpdatePlayerRecords().catch((err) => {
                            captureUnexpectedError(err, {
                                layer: 'client',
                                component: 'AdminUpdatePlayerRecords',
                                action: 'updatePlayerRecords',
                                route: '/footy/admin',
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

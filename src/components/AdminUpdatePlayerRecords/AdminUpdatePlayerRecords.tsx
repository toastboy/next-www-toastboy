'use client';

import { ActionIcon, Button, Center, Container, RingProgress, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { updatePlayerRecords } from 'actions/updatePlayerRecords';
import { useRecordsProgress } from 'lib/swr';
import { useEffect } from 'react';

export type Props = unknown;

const AdminUpdatePlayerRecords: React.FC<Props> = () => {
    const { data, mutate } = useRecordsProgress();

    useEffect(() => {
        const intervalId = setInterval(() => {
            mutate().catch((err) => {
                console.error('Failed to mutate player records progress');
                throw err;
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
                            </Center>
                            :
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
                        updatePlayerRecords().catch((err) => {
                            console.error('Failed to update player records');
                            throw err;
                        });
                    }}
                >
                    Update Player Records
                </Button>
            </Container>
        </>
    );
};

export default AdminUpdatePlayerRecords;

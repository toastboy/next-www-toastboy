'use client';

import { ActionIcon, Alert, Button, Center, Container, Loader, RingProgress, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { updatePlayerRecords } from 'actions/updatePlayerRecords';
import { useRecordsProgress } from 'lib/swr';
import { useEffect } from 'react';

const AdminUpdatePlayerRecords: React.FC = () => {
    const { data, error, isLoading, mutate } = useRecordsProgress();
    const errorIcon = <IconAlertTriangle />;

    useEffect(() => {
        const intervalId = setInterval(() => {
            mutate();
        }, 100);

        return () => clearInterval(intervalId);
    }, [mutate]);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data || data.length !== 2) {
        return <Alert title="Error" icon={errorIcon}>{error?.message || 'An unknown error occurred'}</Alert>;
    }

    const progress = Math.floor(100 * data[0] / data[1]);

    return (
        <>
            <Container>
                <RingProgress
                    label={
                        progress === 100 ?
                            <Center>
                                <ActionIcon color="teal" variant="light" radius="xl" size="xl">
                                    <IconCheck />
                                </ActionIcon>
                            </Center>
                            :
                            <Text c="blue" fw={700} ta="center" size="xl">
                                {progress}%
                            </Text>
                    }
                    sections={[
                        { value: progress, color: progress === 100 ? 'teal' : 'blue' },
                    ]}
                />
                <Button
                    type="button"
                    onClick={() => {
                        updatePlayerRecords();
                    }}
                >
                    Update Player Records
                </Button>
            </Container>
        </>
    );
};

export default AdminUpdatePlayerRecords;

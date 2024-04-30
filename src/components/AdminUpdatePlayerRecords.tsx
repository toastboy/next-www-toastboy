'use client';

import { ActionIcon, Button, Center, Container, RingProgress, Text, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { updatePlayerRecords } from 'actions/updatePlayerRecords';
import { useEffect } from 'react';
import { useRecordsProgress } from 'use/records';

export function AdminUpdatePlayerRecords() {
    const { data, error, mutate } = useRecordsProgress();

    useEffect(() => {
        const intervalId = setInterval(() => {
            mutate();
        }, 100);

        return () => clearInterval(intervalId);
    }, [mutate]);

    if (error) return <div>failed to load</div>;

    const progress = Math.floor(data ? 100 * data[0] / data[1] : 0);

    return (
        <>
            <Container>
                <RingProgress
                    label={
                        progress === 100 ?
                            <Center>
                                <ActionIcon color="teal" variant="light" radius="xl" size="xl">
                                    <IconCheck style={{ width: rem(22), height: rem(22) }} />
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
                <form action={updatePlayerRecords}>
                    <Button type="submit">Update Player Records</Button>
                </form>
            </Container>
        </>
    );
}

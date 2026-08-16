'use client';

import { Center, Container, Flex, Title } from '@mantine/core';

import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { GetProgressProxy } from '@/types/actions/GetProgress';
import { UpdatePlayerRecordsProxy } from '@/types/actions/UpdatePlayerRecords';

export interface Props {
    onUpdatePlayerRecords: UpdatePlayerRecordsProxy;
    getProgress: GetProgressProxy;
    onExportAuth: () => Promise<void>;
}

export const AdminDashboard = ({
    onUpdatePlayerRecords,
    getProgress,
    onExportAuth,
}: Props) => {
    return (
        <Container
            size="xs"
            mt="xl"
        >
            <Center>
                <Title
                    order={1}
                    mb="md"
                >
                    Admin Dashboard
                </Title>
            </Center>

            <Flex
                mb="lg"
                gap="md"
                wrap="wrap"
                justify="center"
            >
                <AdminUpdatePlayerRecords
                    onUpdatePlayerRecords={onUpdatePlayerRecords}
                    getProgress={getProgress}
                />
                <AdminExportAuth onExportAuth={onExportAuth} />
            </Flex>
        </Container>
    );
};

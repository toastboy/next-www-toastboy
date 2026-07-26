import { Center, Container, Flex, Paper, Title } from '@mantine/core';

import { authExport } from '@/actions/auth-export';
import { getProgress } from '@/actions/getProgress';
import { updatePlayerRecords } from '@/actions/updatePlayerRecords';
import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';

const AdminPage = () => {
    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={1} mb="md">
                    Admin Dashboard
                </Title>
            </Center>

            <Paper w="100%" p="xl">
                <Flex mb="lg" gap="md" wrap="wrap" justify="center">
                    <AdminUpdatePlayerRecords onUpdatePlayerRecords={updatePlayerRecords} getProgress={getProgress} />
                    <AdminExportAuth onExportAuth={authExport} />
                </Flex>
            </Paper>
        </Container >
    );
};

export default AdminPage;

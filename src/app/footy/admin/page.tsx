import { Center, Container, Stack, Title } from '@mantine/core';

import { authExport } from '@/actions/auth-export';
import { getProgress } from '@/actions/getProgress';
import { updatePlayerRecords } from '@/actions/updatePlayerRecords';
import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';

const AdminPage = () => {
    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >
                    Admin Dashboard
                </Title>
            </Center>

            <Stack mb="lg">
                <AdminUpdatePlayerRecords onUpdatePlayerRecords={updatePlayerRecords} getProgress={getProgress} />
                <AdminExportAuth onExportAuth={authExport} />
            </Stack>
        </Container >
    );
};

export default AdminPage;

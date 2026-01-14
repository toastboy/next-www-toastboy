import { Center, Container, Stack, Title } from '@mantine/core';

import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';

const Page: React.FC = () => {
    return (
        <Container size="xs" mt="xl" >
            <Center>
                <Title order={2} mb="md" >
                    Admin Dashboard
                </Title>
            </Center>

            <MustBeLoggedIn admin={true}>
                <Stack mb="lg">
                    <AdminUpdatePlayerRecords />
                    <AdminExportAuth />
                    <AdminPlayerList />
                </Stack>
            </MustBeLoggedIn>
        </Container >
    );
};

export default Page;

import { Center, Container, Stack, Title } from '@mantine/core';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import playerService from '@/services/Player';

const Page: React.FC = async () => {
    const players = await playerService.getAll();

    return (
        <Container fluid mt="xl">
            <Center>
                <Title order={2} mb="md" >
                    Admin: Players
                </Title>
            </Center>

            <MustBeLoggedIn admin={true}>
                <Stack mb="lg">
                    <AdminPlayerList
                        players={players}
                    />
                </Stack>
            </MustBeLoggedIn>
        </Container >
    );
};

export default Page;

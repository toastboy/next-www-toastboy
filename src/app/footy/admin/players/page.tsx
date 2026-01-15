import { Center, Container, Stack, Title } from '@mantine/core';
import { headers } from 'next/headers';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { auth } from '@/lib/auth';
import { getMockAuthState, getMockUsersList } from '@/lib/authServer';
import playerService from '@/services/Player';

const Page: React.FC = async () => {
    const players = await playerService.getAll();
    const mockState = await getMockAuthState();
    const users: { email?: string | null }[] = mockState === 'admin'
        ? getMockUsersList()
        : mockState === 'none'
            ? (await auth.api.listUsers({
                headers: await headers(),
                query: {
                    limit: 1000,
                },
            }))?.users ?? []
            : [];
    const userEmails = users
        .map((user) => user.email)
        .filter((email): email is string => !!email);

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
                        userEmails={userEmails}
                    />
                </Stack>
            </MustBeLoggedIn>
        </Container >
    );
};

export default Page;

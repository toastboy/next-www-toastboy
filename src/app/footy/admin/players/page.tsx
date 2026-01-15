import { Center, Container, Stack, Title } from '@mantine/core';
import { headers } from 'next/headers';

import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { auth } from '@/lib/auth';
import playerService from '@/services/Player';

const Page: React.FC = async () => {
    const players = await playerService.getAll();
    const users = (await auth.api.listUsers({
        headers: await headers(),
        query: {
            limit: 1000,
        },
    }))?.users ?? [];
    const userEmails = users
        .map((user) => user.email)
        .filter((email): email is string => !!email);
    const userIdByEmail = users.reduce<Record<string, string>>((acc, user) => {
        if (user.email) {
            acc[user.email.trim().toLowerCase()] = user.id;
        }
        return acc;
    }, {});

    return (
        <Container fluid mt="xl">
            <Center>
                <Title order={2} mb="md" >
                    Admin: Players
                </Title>
            </Center>

            <Stack mb="lg">
                <AdminPlayerList
                    players={players}
                    userEmails={userEmails}
                    userIdByEmail={userIdByEmail}
                />
            </Stack>
        </Container >
    );
};

export default Page;

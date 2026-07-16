import { Center, Container, Stack, Title } from '@mantine/core';

import { listUsersAction } from '@/actions/auth';
import { addPlayerInvite } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import { AdminPlayerList } from '@/components/AdminPlayerList/AdminPlayerList';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import playerService from '@/services/Player';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'Players Admin' };

const AdminPlayersPage = async () => {
    const players = await playerService.getAll();
    const users = await listUsersAction(undefined, 1000);
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
            <AutoRefresh channels={FootyChannel.Players} />
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
                    onAddPlayerInvite={addPlayerInvite}
                    onSendEmail={sendEmail}
                />
            </Stack>
        </Container >
    );
};

export default AdminPlayersPage;

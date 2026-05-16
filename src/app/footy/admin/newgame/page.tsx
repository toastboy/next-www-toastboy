import { Container, Title } from '@mantine/core';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { NewGameForm } from '@/components/NewGameForm/NewGameForm';
import { FootyChannel } from '@/types/FootyChannel';

export const metadata = { title: 'New Game' };

const NewGamePage = () => {
    return (
        <Container size="sm">
            <AutoRefresh channels={FootyChannel.Invitations} />
            <Title order={2} mb="md">
                New game
            </Title>
            <NewGameForm onTriggerInvitations={triggerInvitations} />
        </Container>
    );
};

export default NewGamePage;

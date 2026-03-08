import { Container, Title } from '@mantine/core';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { NewGameForm } from '@/components/NewGameForm/NewGameForm';

export const metadata = { title: 'New Game' };

const NewGamePage = () => {
    return (
        <Container size="sm">
            <Title order={2} mb="md">
                New game
            </Title>
            <NewGameForm onTriggerInvitations={triggerInvitations} />
        </Container>
    );
};

export default NewGamePage;

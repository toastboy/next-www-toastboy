import { Container, Title } from '@mantine/core';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { NewGameForm } from '@/components/NewGameForm/NewGameForm';

type PageProps = object;

const Page: React.FC<PageProps> = () => {
    return (
        <Container size="sm">
            <Title order={2} mb="md">
                New game
            </Title>
            <NewGameForm onTriggerInvitations={triggerInvitations} />
        </Container>
    );
};

export default Page;

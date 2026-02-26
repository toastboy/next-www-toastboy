'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Center, Container, Title } from '@mantine/core';

import { UserWithRolePayload } from '@/lib/actions/auth/auth';

export interface Props {
    user: UserWithRolePayload;
}

export const AdminUserData: React.FC<Props> = ({ user }) => {
    return (
        <Container size="xs" mt="xl">
            <Center>
                <Title order={2} mb="md">
                    {user.name}
                </Title>
            </Center>

            <CodeHighlight
                code={JSON.stringify(user, null, 2)}
                language="json"
            />
        </Container>
    );
};

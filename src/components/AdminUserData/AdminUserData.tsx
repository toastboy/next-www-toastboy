'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Center, Container, Paper, Title } from '@mantine/core';

import type { UserWithRolePayload } from '@/lib/core/auth';

export interface Props {
    user: UserWithRolePayload;
}

export const AdminUserData = ({ user }: Props) => {
    return (
        <Container size="xs" mt="xl">
            <Paper p="xl">
                <Center>
                    <Title order={2} mb="md">
                        {user.name}
                    </Title>
                </Center>

                <CodeHighlight
                    code={JSON.stringify(user, null, 2)}
                    language="json"
                />
            </Paper>
        </Container>
    );
};

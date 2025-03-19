import { Text } from '@mantine/core';
import { headers } from "next/headers";
import { ReactNode } from 'react';
import { authClient } from 'src/lib/auth-client';

type Props = {
    children: ReactNode;
};

async function MustBeAdmin({ children }: Props) {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });

    if (!session || !session.data || session.data.user.role !== "admin") {
        return <Text>You must be logged in as an administrator to use this page.</Text>;
    }

    return <>{children}</>;
};

export default MustBeAdmin;

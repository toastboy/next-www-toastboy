import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

interface PageProps {
    searchParams?: Promise<{
        name?: string;
        email?: string;
        token?: string;
        error?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { name, email, token, error } = searchParams ?? {};
    let errorMessage = error;

    if (!errorMessage && (!email || !name || !token)) {
        errorMessage = 'Missing required invitation details.';
    }

    if (errorMessage) {
        return (
            <Notification
                icon={<IconX size={18} />}
                color="red"
            >
                <Text>{errorMessage}</Text>
            </Notification>
        );
    }

    return (
        <ClaimSignup
            name={name ?? ''}
            email={email ?? ''}
            token={token ?? ''}
        />
    );
};

export default Page;

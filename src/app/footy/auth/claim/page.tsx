import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';
    let name: string | null = null;
    let email: string | null = null;
    let errorMessage: string | null = null;

    try {
        const result = await claimPlayerInvitation(token);
        name = result.player.name;
        email = result.email;
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unable to claim invitation.';
    }

    if (!email || !name) {
        errorMessage = "Invitation is missing required details.";
    }

    if (errorMessage) {
        return (
            <Notification
                icon={<IconX size={18} />}
                color="red"
            >
                <Text>Invitation problem: {errorMessage}</Text>
            </Notification>
        );
    }

    return (
        <ClaimSignup
            name={name ?? ''}
            email={email ?? ''}
            token={token}
        />
    );
};

export default Page;

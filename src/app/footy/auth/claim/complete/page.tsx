import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { redirect } from 'next/navigation';

import { finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';

    if (!token) {
        return (
            <Notification
                icon={<IconX size={18} />}
                color="red"
            >
                <Text>Invitation problem: Missing invitation token.</Text>
            </Notification>
        );
    }

    try {
        await finalizePlayerInvitationClaim(token);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to finalize invitation.';
        return (
            <Notification
                icon={<IconX size={18} />}
                color="red"
            >
                <Text>Invitation problem: {message}</Text>
            </Notification>
        );
    }

    redirect('/footy/profile');
};

export default Page;

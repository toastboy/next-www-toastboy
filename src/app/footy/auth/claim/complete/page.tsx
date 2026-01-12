import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { redirect } from 'next/navigation';

import { finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';
import { config } from '@/lib/config';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';

    // TODO: the logic needs moving into an API route

    if (!token) {
        return (
            <Notification
                icon={<IconX size={config.notificationIconSize} />}
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
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
            >
                <Text>Invitation problem: {message}</Text>
            </Notification>
        );
    }

    redirect('/footy/profile');
};

export default Page;

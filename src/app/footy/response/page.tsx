export const dynamic = 'force-dynamic';

import { Anchor, Box, Text } from '@mantine/core';
import { redirect } from 'next/navigation';

import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
        uuid?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? searchParams?.uuid ?? '';

    if (!token) {
        redirect('/footy/game');
    }

    const details = await getGameInvitationResponseDetails(token);
    if (!details) {
        return (
            <Box>
                <Text>Invitation not found.</Text>
                <Anchor href="/footy/game">Go to the game page</Anchor>
            </Box>
        );
    }

    return (
        <Box maw={560}>
            <GameInvitationResponseForm details={details} />
        </Box>
    );
};

export default Page;

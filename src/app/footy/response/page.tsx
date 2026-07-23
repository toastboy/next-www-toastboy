import { Anchor, Box, Paper, Text } from '@mantine/core';
import { redirect } from 'next/navigation';

import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
        playerId?: string;
        playerName?: string;
        playerLogin?: string;
        gameDayId?: string;
        response?: string;
        goalie?: string;
        comment?: string;
        error?: string;
    }>;
}

export const metadata = { title: 'Response' };

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { token } = searchParams ?? {};
    const errorMessage = searchParams?.error ?? '';

    if (!token && !errorMessage) {
        redirect('/footy/game');
    }

    if (errorMessage) {
        return (
            <Box>
                <Text>{errorMessage}</Text>
                <Anchor href="/footy/game">Go to the game page</Anchor>
            </Box>
        );
    }

    /* v8 ignore next -- token is always truthy here; the guards above already redirect/return for the falsy cases */
    const details = await getGameInvitationResponseDetails(token ?? '');

    if (!details) {
        return (
            <Box>
                <Text>Invitation details are missing.</Text>
                <Anchor href="/footy/game">Go to the game page</Anchor>
            </Box>
        );
    }

    return (
        <Paper w="100%" maw="35rem" p="xl">
            <GameInvitationResponseForm
                details={details}
                onSubmitGameInvitationResponse={submitGameInvitationResponse}
            />
        </Paper>
    );
};

export default Page;

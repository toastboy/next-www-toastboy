export const dynamic = 'force-dynamic';

import { Anchor, Box, Text } from '@mantine/core';
import { redirect } from 'next/navigation';

import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import type { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

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

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { token, playerId, playerName, playerLogin, gameDayId, response, goalie, comment } = searchParams ?? {};
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

    const details: GameInvitationResponseDetails = {
        token: token ?? '',
        playerId: Number(playerId),
        playerName: playerName ?? '',
        playerLogin: playerLogin ?? null,
        gameDayId: Number(gameDayId ?? 0),
        response: (response as GameInvitationResponseDetails['response']) ?? null,
        goalie: goalie === 'true',
        comment: comment ?? null,
    };

    if (!details.playerId || !details.playerName || !details.gameDayId) {
        return (
            <Box>
                <Text>Invitation details are missing.</Text>
                <Anchor href="/footy/game">Go to the game page</Anchor>
            </Box>
        );
    }

    return (
        <Box maw={560}>
            <GameInvitationResponseForm
                details={details}
                onSubmitGameInvitationResponse={submitGameInvitationResponse}
            />
        </Box>
    );
};

export default Page;

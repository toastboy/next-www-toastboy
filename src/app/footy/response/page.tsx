import { Anchor, Text } from '@mantine/core';
import { redirect } from 'next/navigation';

import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

export const metadata = { title: 'Response' };

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { token } = searchParams ?? {};

    if (!token) {
        redirect('/footy/game');
    }

    const details = await getGameInvitationResponseDetails(token);

    if (!details) {
        return (
            <>
                <Text>Invitation details are missing.</Text>
                <Anchor href="/footy/game">Go to the game page</Anchor>
            </>
        );
    }

    return (
        <GameInvitationResponseForm
            details={details}
            onSubmitGameInvitationResponse={submitGameInvitationResponse}
        />
    );
};

export default Page;

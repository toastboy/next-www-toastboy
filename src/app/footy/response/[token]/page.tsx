import { Anchor, Text } from '@mantine/core';

import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

interface PageProps {
    params: Promise<{ token: string }>;
}

export const metadata = { title: 'Response' };

const Page = async ({ params }: PageProps) => {
    const { token } = await params;
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

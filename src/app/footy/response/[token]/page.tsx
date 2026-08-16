import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
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
            <StatusNotification
                variant="plain"
                message="Invitation details are missing."
                anchor={{ href: '/footy/game', label: 'Go to the game page' }}
            />
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

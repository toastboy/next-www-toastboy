import { IconX } from '@tabler/icons-react';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

interface PageProps {
    params: Promise<{ token: string }>;
}

export const metadata = { title: 'Sign Up' };

const Page = async ({ params }: PageProps) => {
    const { token } = await params;
    let invitation: { name: string; email: string } | undefined;
    let errorMessage: string | undefined;

    try {
        invitation = await claimPlayerInvitation(token);
    } catch (error) {
        captureUnexpectedError(error, {
            layer: 'server',
            action: 'claimPlayerInvitation',
            component: 'ClaimSignup',
            route: '/footy/auth/claim/[token]',
        });

        errorMessage = toPublicMessage(
            error,
            'This invitation link is invalid.',
        );
    }

    if (!invitation) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                withCloseButton={false}
                message={errorMessage}
            />
        );
    }

    return (
        <ClaimSignup
            name={invitation.name}
            email={invitation.email}
            token={token}
        />
    );
};

export default Page;

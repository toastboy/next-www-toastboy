import { Anchor, Notification, Stack } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { redirect } from 'next/navigation';

import { finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

interface PageProps {
    params: Promise<{ token: string }>;
}

export const metadata = { title: 'Sign Up' };

const Page = async ({ params }: PageProps) => {
    const { token } = await params;
    let errorMessage: string | undefined;

    try {
        await finalizePlayerInvitationClaim(token);
    } catch (error) {
        captureUnexpectedError(error, {
            layer: 'server',
            action: 'finalizePlayerInvitationClaim',
            component: 'ClaimSignup',
            route: '/footy/auth/claim/[token]/finish',
        });

        errorMessage = toPublicMessage(error, 'Unable to finalize invitation.');
    }

    if (errorMessage) {
        return (
            <Stack>
                <Notification
                    icon={<IconX size={config.notificationIconSize} />}
                    color="red"
                    withCloseButton={false}
                >
                    {errorMessage}
                </Notification>
                <Anchor href="/footy">Return to the home page</Anchor>
            </Stack>
        );
    }

    redirect('/footy/profile');
};

export default Page;

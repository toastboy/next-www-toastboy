import { Anchor, Notification, Paper, Stack, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

interface PageProps {
    params: Promise<{ token: string }>;
}

export const metadata = { title: 'Sign Up' };

// TODO: Work out whether things like this <Paper> should be in the page or
// in the component. This will probably best be done when I work on using
// <Container> where appropriate, and then I can see if it makes sense to
// have the <Paper> in the page or in the component.

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

        errorMessage = toPublicMessage(error, 'This invitation link is invalid.');
    }

    return (
        <Paper w="100%" maw="35rem" p="xl">
            {invitation ? (
                <ClaimSignup name={invitation.name} email={invitation.email} token={token} />
            ) : (
                <Stack>
                    <Notification
                        icon={<IconX size={config.notificationIconSize} />}
                        color="red"
                        withCloseButton={false}
                    >
                        {errorMessage}
                    </Notification>
                    <Text ta="center">
                        <Anchor href="/footy">Return to the home page</Anchor>
                    </Text>
                </Stack>
            )}
        </Paper>
    );
};

export default Page;

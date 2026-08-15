import { Anchor, Notification, Stack } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { redirect } from 'next/navigation';

import { verifyEmail } from '@/actions/verifyEmail';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

interface PageProps {
    params: Promise<{ token: string }>;
}

export const metadata = { title: 'Verify Email' };

const Page = async ({ params }: PageProps) => {
    const { token } = await params;
    let errorMessage: string | undefined;

    try {
        await verifyEmail(token);
    } catch (error) {
        captureUnexpectedError(error, {
            layer: 'server',
            action: 'verifyEmail',
            component: 'ExtraEmailVerify',
            route: '/footy/auth/verify/extra-email/[token]',
        });

        errorMessage = toPublicMessage(error, 'Unable to verify email.');
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
                <Anchor href="/footy/profile">Return to your profile</Anchor>
            </Stack>
        );
    }

    return redirect('/footy/profile');
};

export default Page;

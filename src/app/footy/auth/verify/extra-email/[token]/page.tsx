import { IconX } from '@tabler/icons-react';
import { redirect } from 'next/navigation';

import { verifyEmail } from '@/actions/verifyEmail';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
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
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                withCloseButton={false}
                message={errorMessage}
                anchor={{
                    href: '/footy/profile',
                    label: 'Return to your profile',
                }}
            />
        );
    }

    return redirect('/footy/profile');
};

export default Page;

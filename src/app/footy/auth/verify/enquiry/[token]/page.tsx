import { IconCheck, IconX } from '@tabler/icons-react';

import { deliverContactEnquiry } from '@/actions/sendEnquiry';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

interface PageProps {
    params: Promise<{ token: string }>;
}

export const metadata = { title: 'Enquiry Confirmed' };

const Page = async ({ params }: PageProps) => {
    const { token } = await params;
    let errorMessage: string | undefined;

    try {
        await deliverContactEnquiry(token);
    } catch (error) {
        captureUnexpectedError(error, {
            layer: 'server',
            action: 'deliverContactEnquiry',
            component: 'EnquiryVerify',
            route: '/footy/auth/verify/enquiry/[token]',
        });

        errorMessage = toPublicMessage(
            error,
            'Unable to deliver your message.',
        );
    }

    if (errorMessage) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                withCloseButton={false}
                message={errorMessage}
                anchor={{ href: '/footy', label: 'Return to the home page' }}
            />
        );
    }

    return (
        <StatusNotification
            icon={<IconCheck size={config.notificationIconSize} />}
            color="teal"
            withCloseButton={false}
            message="Thanks for your message. We will get back to you soon."
            anchor={{ href: '/footy', label: 'Return to the home page' }}
        />
    );
};

export default Page;

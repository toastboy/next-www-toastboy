import { Notification, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import { verifyEmail } from '@/actions/verifyEmail';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';

    let notificationIcon = <IconCheck size={18} />;
    let notificationColor: 'teal' | 'red' = 'teal';
    let message = 'Email verified successfully.';

    try {
        await verifyEmail(token);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to verify email.';
        notificationIcon = <IconX size={18} />;
        notificationColor = 'red';
        message = `Verification problem: ${errorMessage}`;
    }

    return (
        <Notification
            icon={notificationIcon}
            color={notificationColor}
        >
            <Text>{message}</Text>
        </Notification>
    );
};

export default Page;

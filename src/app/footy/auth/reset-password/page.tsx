import { IconX } from '@tabler/icons-react';

import { PasswordResetForm } from '@/components/PasswordResetForm/PasswordResetForm';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { config } from '@/lib/config';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

export const metadata = { title: 'Reset Password' };

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';

    if (!token) {
        return (
            <StatusNotification
                icon={<IconX size={config.notificationIconSize} />}
                color="red"
                message="Password reset link is missing or invalid."
            />
        );
    }

    return <PasswordResetForm token={token} />;
};

export default Page;

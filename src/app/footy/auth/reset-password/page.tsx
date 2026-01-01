import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { PasswordReset } from '@/components/PasswordReset/PasswordReset';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

/**
 * Render the reset password page, validating that a token exists before showing the form.
 */
const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';

    if (!token) {
        return (
            <Notification icon={<IconX size={18} />} color="red">
                <Text>Password reset link is missing or invalid.</Text>
            </Notification>
        );
    }

    return <PasswordReset token={token} />;
};

export default Page;

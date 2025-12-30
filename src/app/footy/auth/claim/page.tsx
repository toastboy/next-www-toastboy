import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';
import { getCurrentUser } from '@/lib/authServer';

const Page = async () => {
    const user = await getCurrentUser();

    if (!user?.email) {
        return (
            <Notification
                icon={<IconX size={18} />}
                color="red"
            >
                <Text>Account problem: Please verify your email first.</Text>
            </Notification>
        );
    }

    return (
        <ClaimSignup
            name={user.name ?? ''}
            email={user.email}
        />
    );
};

export default Page;

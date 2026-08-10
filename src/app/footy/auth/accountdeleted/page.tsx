import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { config } from '@/lib/config';

export const metadata = { title: 'Account Deleted' };

const AccountDeletedPage = () => {
    return (
        <Notification
            icon={<IconX size={config.notificationIconSize} />}
            color="blue"
        >
            <Text>Your account has been successfully deleted.</Text>
        </Notification>
    );
};

export default AccountDeletedPage;

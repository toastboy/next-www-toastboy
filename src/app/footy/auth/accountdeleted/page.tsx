import { IconX } from '@tabler/icons-react';

import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { config } from '@/lib/config';

export const metadata = { title: 'Account Deleted' };

const AccountDeletedPage = () => {
    return (
        <StatusNotification
            icon={<IconX size={config.notificationIconSize} />}
            color="blue"
            message="Your account has been successfully deleted."
        />
    );
};

export default AccountDeletedPage;

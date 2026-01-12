import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { config } from '@/lib/config';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <Notification
            icon={<IconX size={config.notificationIconSize} />}
            color="blue"
        >
            <Text>Your account has been successfully deleted.</Text>
        </Notification>
    );
};

export default Page;

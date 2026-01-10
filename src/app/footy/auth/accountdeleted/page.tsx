import { Notification, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <Notification
            icon={<IconX size={18} />}
            color="blue"
        >
            <Text>Your account has been successfully deleted.</Text>
        </Notification>
    );
};

export default Page;

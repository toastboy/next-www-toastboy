'use client';

import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { config } from '@/lib/config';

export const SearchParamErrorNotification = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const hasShownErrorNotification = useRef(false);

    useEffect(() => {
        if (!error || hasShownErrorNotification.current) {
            return;
        }

        notifications.show({
            color: 'red',
            title: 'Error',
            message: error,
            icon: <IconX size={config.notificationIconSize} />,
            loading: false,
            autoClose: false,
            withCloseButton: true,
        });

        hasShownErrorNotification.current = true;
    }, [error]);

    return <></>;
};

'use client';

import { Button, Flex, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

export interface Props {
    onExportAuth: () => Promise<void>;
}

export const AdminExportAuth = ({ onExportAuth }: Props) => {
    const [exporting, setExporting] = useState(false);

    return (
        <Flex direction="row" align="flex-end" justify="center" gap="md" p="md">
            <Button
                type="button"
                loading={exporting}
                disabled={exporting}
                onClick={async () => {
                    setExporting(true);

                    const id = notifications.show({
                        loading: true,
                        title: 'Exporting Auth Data',
                        message: 'Please wait...',
                        autoClose: false,
                        withCloseButton: false,
                    });

                    try {
                        await onExportAuth();
                        notifications.update({
                            id,
                            color: 'green',
                            title: 'Success',
                            message: 'Auth data exported successfully',
                            icon: (
                                <IconCheck
                                    style={{ width: rem(18), height: rem(18) }}
                                />
                            ),
                            loading: false,
                            autoClose: config.notificationAutoClose,
                        });
                    } catch (error) {
                        captureUnexpectedError(error, {
                            layer: 'client',
                            component: 'AdminExportAuth',
                            action: 'exportAuth',
                            route: '/footy/admin',
                        });
                        notifications.update({
                            id,
                            color: 'red',
                            title: 'Error',
                            message: toPublicMessage(
                                error,
                                'Failed to export auth data.',
                            ),
                            icon: (
                                <IconX
                                    style={{ width: rem(18), height: rem(18) }}
                                />
                            ),
                            loading: false,
                            autoClose: config.notificationAutoClose,
                        });
                    } finally {
                        setExporting(false);
                    }
                }}
            >
                Export Auth Data
            </Button>
        </Flex>
    );
};

'use client';

import { Button, Container, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

import { config } from '@/lib/config';

export interface Props {
    onExportAuth: () => Promise<void>,
}

export const AdminExportAuth: React.FC<Props> = ({ onExportAuth }) => {
    return (
        <>
            <Container>
                <Button
                    data-testid="export-auth-button"
                    type="button"
                    onClick={async () => {
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
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: config.notificationAutoClose,
                            });
                        }
                        catch (error) {
                            notifications.update({
                                id,
                                color: 'red',
                                title: 'Error',
                                message: `Failed to export auth data: ${String(error)}`,
                                icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: config.notificationAutoClose,
                            });
                        }
                    }}
                >
                    Export Auth Data
                </Button>
            </Container>
        </>
    );
};

export default AdminExportAuth;

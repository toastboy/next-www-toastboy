'use client';

import { Button, Container, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { authExport } from 'actions/auth-export';

const AdminUpdatePlayerRecords: React.FC = () => {
    return (
        <>
            <Container>
                <Button
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
                            await authExport();
                            notifications.update({
                                id,
                                color: 'green',
                                title: 'Success',
                                message: 'Auth data exported successfully',
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 2000,
                            });
                        } catch (error) {
                            notifications.update({
                                id,
                                color: 'red',
                                title: 'Error',
                                message: 'Failed to export auth data',
                                icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 2000,
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

export default AdminUpdatePlayerRecords;

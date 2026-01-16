'use client';

import { Avatar, Flex, Group, Menu, rem, Text, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconArrowsLeftRight, IconCheck, IconChevronRight, IconLogout, IconPassword, IconTrash, IconUserOff, IconUserScan } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthUserSummary } from 'types/AuthUser';

import { config } from '@/lib/config';

import classes from './UserButton.module.css';

export interface Props {
    user?: AuthUserSummary | null;
}

export const UserButton: React.FC<Props> = ({ user }) => {
    const router = useRouter();

    async function signOut() {
        const id = notifications.show({
            loading: true,
            title: 'Signing out',
            message: 'Signing out...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const response = await fetch('/api/auth/sign-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{}',
            });
            if (!response.ok) {
                console.error('Sign out failed', await response.text());
                throw new Error('Sign out failed');
            }
            router.refresh();
            notifications.update({
                id,
                color: 'teal',
                title: 'Signed out',
                message: 'Signed out successfully',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(error)}`,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        }
    }

    async function stopImpersonating() {
        const id = notifications.show({
            loading: true,
            title: 'Ending impersonation',
            message: 'Restoring your session...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const response = await fetch('/api/auth/admin/stop-impersonating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{}',
            });
            if (!response.ok) {
                console.error('Stop impersonation failed', await response.text());
                throw new Error('Stop impersonation failed');
            }
            router.refresh();
            notifications.update({
                id,
                color: 'teal',
                title: 'Impersonation ended',
                message: 'Back to your account.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(error)}`,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        }
    }

    let name = 'Sign In';
    let email = '';
    let playerId = 0;

    if (user) {
        name = user.name ?? '';
        email = user.email ?? '';
        playerId = user.playerId;
    }

    const userMenu = user ?
        <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item leftSection={<IconUserScan size={14} />}>
                <Link className={classes.link} href="/footy/profile">
                    My Profile
                </Link>
            </Menu.Item>
            <Menu.Item leftSection={<IconPassword size={14} />}>
                <Link className={classes.link} href="/footy/password">
                    Change Password
                </Link>
            </Menu.Item>
            {user.impersonatedBy ? (
                <Menu.Item leftSection={<IconUserOff size={14} />} onClick={async () => { await stopImpersonating(); }}>
                    End impersonation
                </Menu.Item>
            ) : null}
            <Menu.Item leftSection={<IconLogout size={14} />} onClick={async () => { await signOut(); }}>
                Sign Out
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>My Data</Menu.Label>
            <Menu.Item
                leftSection={<IconArrowsLeftRight size={14} />}
            >
                <Link className={classes.link} href="/footy/download-data">
                    Download all data
                </Link>
            </Menu.Item>
            <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
            >
                <Link className={classes.link} href="/footy/deleteaccount">
                    Delete account
                </Link>
            </Menu.Item>
        </Menu.Dropdown> : null;

    return (
        <Menu shadow="md" width={200} position="right-end">
            <Menu.Target>
                <UnstyledButton
                    data-testid="user-button"
                    className={classes.user}
                    onClick={() => {
                        if (!user) router.push('/footy/auth/signin');
                    }}
                >
                    <Group>
                        <Avatar
                            data-testid="user-avatar"
                            src={playerId !== 0 ? `/api/footy/player/${playerId}/mugshot` : undefined}
                            radius="xl"
                        />

                        <Flex direction={'column'}>
                            <Text
                                data-testid="user-name"
                                size="sm"
                                fw={500}
                            >
                                {name}
                            </Text>

                            <Text
                                data-testid="user-email"
                                c="dimmed"
                                size="xs"
                            >
                                {email}
                            </Text>
                        </Flex>

                        <IconChevronRight
                            data-testid="chevron-icon"
                            style={{ width: rem(14), height: rem(14) }} stroke={1.5}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            {userMenu}
        </Menu>
    );
};

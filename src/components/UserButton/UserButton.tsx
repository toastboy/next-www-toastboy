'use client';

import {
    Avatar,
    Flex,
    Group,
    Menu,
    MenuDivider,
    MenuDropdown,
    MenuItem,
    MenuLabel,
    MenuTarget,
    rem,
    Text,
    UnstyledButton,
} from '@mantine/core';
import {
    notifications,
} from '@mantine/notifications';
import { IconAlertTriangle, IconArrowsLeftRight, IconCheck, IconChevronRight, IconLogout, IconPassword, IconTrash, IconUserOff, IconUserScan } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { config } from '@/lib/config';
import { assertOkResponse, toPublicMessage } from '@/lib/errors';
import { AuthUserSummary } from '@/types/AuthUser';

import classes from './UserButton.module.css';

export interface Props {
    user?: AuthUserSummary | null;
}

export const UserButton = ({ user }: Props) => {
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
            await assertOkResponse(response, {
                method: 'POST',
                fallbackMessage: 'Sign out failed',
            });
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
            const message = toPublicMessage(error, 'Sign out failed');
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
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
            await assertOkResponse(response, {
                method: 'POST',
                fallbackMessage: 'Stop impersonation failed',
            });
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
            const message = toPublicMessage(error, 'Stop impersonation failed');
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
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

    const userMenu = user ? (
        <MenuDropdown>
            <MenuLabel>Account</MenuLabel>
            <MenuItem leftSection={<IconUserScan size={14} />}>
                <Link className={classes.link} href="/footy/profile">
                    My Profile
                </Link>
            </MenuItem>
            <MenuItem leftSection={<IconPassword size={14} />}>
                <Link className={classes.link} href="/footy/password">
                    Change Password
                </Link>
            </MenuItem>
            {user.impersonatedBy ? (
                <MenuItem leftSection={<IconUserOff size={14} />} onClick={async () => { await stopImpersonating(); }}>
                    End impersonation
                </MenuItem>
            ) : null}
            <MenuItem leftSection={<IconLogout size={14} />} onClick={async () => { await signOut(); }}>
                Sign Out
            </MenuItem>

            <MenuDivider />

            <MenuLabel>My Data</MenuLabel>
            <MenuItem
                leftSection={<IconArrowsLeftRight size={14} />}
            >
                <Link className={classes.link} href="/footy/downloadmydata">
                    Download my data
                </Link>
            </MenuItem>
            <MenuItem
                color="red"
                leftSection={<IconTrash size={14} />}
            >
                <Link className={classes.link} href="/footy/deleteaccount">
                    Delete account
                </Link>
            </MenuItem>
        </MenuDropdown>
    ) : null;

    return (
        <Menu shadow="md" width={200} position="right-end">
            <MenuTarget>
                <UnstyledButton
                    aria-label="User menu"
                    className={classes.user}
                    onClick={() => {
                        if (!user) router.push('/footy/auth/signin');
                    }}
                >
                    <Group>
                        <Avatar
                            src={playerId !== 0 ? `/api/footy/player/${playerId}/mugshot` : undefined}
                            radius="xl"
                        />

                        <Flex direction={'column'}>
                            <Text
                                size="sm"
                                fw={500}
                            >
                                {name}
                            </Text>

                            <Text
                                c="dimmed"
                                size="xs"
                            >
                                {email}
                            </Text>
                        </Flex>

                        <IconChevronRight
                            style={{ width: rem(14), height: rem(14) }} stroke={1.5}
                        />
                    </Group>
                </UnstyledButton>
            </MenuTarget>
            {userMenu}
        </Menu>
    );
};

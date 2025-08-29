'use client';

import { Avatar, Flex, Group, Menu, rem, Text, UnstyledButton } from '@mantine/core';
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle, IconArrowsLeftRight, IconCheck, IconChevronRight, IconLogout, IconPassword, IconTrash, IconUserScan } from '@tabler/icons-react';
import { authClient } from 'lib/authClient';
import Link from 'next/link';
import classes from './UserButton.module.css';

const UserButton: React.FC = () => {
  const user = authClient.getUser();

  async function signOut() {
    const id = notifications.show({
      loading: true,
      title: 'Signing out',
      message: 'Signing out...',
      autoClose: false,
      withCloseButton: false,
    });

    try {
      await authClient.signOut();
      notifications.update({
        id,
        color: 'teal',
        title: 'Signed out',
        message: 'Signed out successfully',
        icon: <IconCheck size={18} />,
        loading: false,
        autoClose: 2000,
      });
    } catch (error) {
      notifications.update({
        id,
        color: 'red',
        title: 'Error',
        message: `${error}`,
        icon: <IconAlertTriangle size={18} />,
        loading: false,
        autoClose: 2000,
      });
    }
  }

  let name = 'Sign In';
  let email = '';
  let playerId = 0;

  if (user) {
    name = user.name;
    email = user.email;
    playerId = user.playerId;
  }

  return (
    <Menu shadow="md" width={200} position="right-end">
      <Menu.Target>
        <UnstyledButton
          className={classes.user}
          onClick={() => {
            if (!user) {
              const url = '/footy/auth/signin';
              try {
                // Trigger real navigation in browsers
                window.location.href = url;
              }
              finally {
                // Ensure JSDOM-based tests can observe the URL change without actual navigation
                window.history.pushState({}, '', url);
              }
            }
          }}
        >
          <Group>
            <Avatar
              src={playerId !== 0 ? `/api/footy/player/${playerId}/mugshot` : undefined}
              radius="xl"
            />

            <Flex direction={'column'}>
              <Text size="sm" fw={500}>
                {name}
              </Text>

              <Text c="dimmed" size="xs">
                {email}
              </Text>
            </Flex>

            <IconChevronRight data-testid="chevron-icon" style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      {user && (
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
          <Menu.Item leftSection={<IconLogout size={14} />} onClick={async () => { await signOut(); }}>
            Sign Out
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>My Data</Menu.Label>
          <Menu.Item
            leftSection={<IconArrowsLeftRight size={14} />}
          >
            <Link className={classes.link} href="/footy/manage-emails">
              Email subscriptions
            </Link>
          </Menu.Item>
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
            <Link className={classes.link} href="/footy/delete-account">
              Delete account
            </Link>
          </Menu.Item>
        </Menu.Dropdown>
      )}
    </Menu>
  );
};

export default UserButton;

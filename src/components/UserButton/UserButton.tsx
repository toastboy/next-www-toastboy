import { Avatar, Container, Flex, Group, Loader, Menu, rem, Text, UnstyledButton } from '@mantine/core';
import { IconArrowsLeftRight, IconChevronRight, IconLogout, IconPassword, IconTrash, IconUserScan } from '@tabler/icons-react';
import { authClient } from 'lib/auth-client';
import Link from 'next/link';
import classes from './UserButton.module.css';

const UserButton: React.FC = () => {
  const {
    data: session,
    isPending,
    error,
  } = authClient.useSession();

  if (isPending) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Text color="red">Error loading user: {error.message}</Text>
      </Container>
    );
  }

  let name = 'Sign In';
  let email = '';
  let playerId = 0;

  if (session && session.user) {
    name = session.user.name;
    email = session.user.email;
    playerId = session.user.playerId;
  }

  return (
    <Menu shadow="md" width={200} position="right-end">
      <Menu.Target>
        <UnstyledButton
          className={classes.user}
          onClick={() => {
            if (!session || !session.user) {
              window.location.href = '/footy/auth/signin';
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

      {session?.user && (
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
          <Menu.Item leftSection={<IconLogout size={14} />}>
            <Link className={classes.link} href="/footy/auth/signout">
              Sign Out
            </Link>
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

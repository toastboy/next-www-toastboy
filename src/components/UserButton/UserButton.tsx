import { Avatar, Container, Flex, Group, Loader, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { IconArrowsLeftRight, IconChevronRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons-react';
import { authClient } from 'lib/auth-client';
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

  var name = 'Sign In';
  var email = '';
  var playerId = 0;

  if (session && session.user) {
    name = session.user.name;
    email = session.user.email;
    // playerId = session.user.playerId;
    playerId = 12; // TODO: Replace with actual player ID
  }

  return (
    <Menu shadow="md" width={200} position="right-end">
      <Menu.Target>
        <UnstyledButton className={classes.user}>
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

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Messages
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto size={14} />}>
          Gallery
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={<IconArrowsLeftRight size={14} />}
        >
          Transfer my data
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<IconTrash size={14} />}
        >
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserButton;

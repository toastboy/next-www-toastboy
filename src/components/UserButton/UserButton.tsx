import { Avatar, Container, Flex, Group, Loader, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { authClient } from 'src/lib/auth-client';
import classes from './UserButton.module.css';

const UserButton: React.FC = () => {
  const {
    data: session,
    isPending,
    error
  } = authClient.useSession()

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
        <Text color="red">Error loading user</Text>
      </Container>
    );
  }

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar
          src="http://localhost:3000/api/footy/player/jonw/mugshot" // TODO: Replace with actual user avatar
          radius="xl"
        />

        <Flex direction={'column'}>
          <Text size="sm" fw={500}>
            {session?.user?.name}
          </Text>

          <Text c="dimmed" size="xs">
            {session?.user?.email}
          </Text>
        </Flex>

        <IconChevronRight data-testid="chevron-icon" style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
};

export default UserButton;

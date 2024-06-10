import { Avatar, Flex, Group, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './UserButton.module.css';

const UserButton: React.FC = () => {
  return (
    <UnstyledButton className={classes.user}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        <Flex direction={'column'}>
          <Text size="sm" fw={500}>
            Harriette Spoonlicker
          </Text>

          <Text c="dimmed" size="xs">
            hspoonlicker@outlook.com
          </Text>
        </Flex>

        <IconChevronRight data-testid="chevron-icon" style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
};

export default UserButton;

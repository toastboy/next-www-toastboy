import { Box, Flex, Group } from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { TeamPlayerType } from '@/types';

export interface Props {
    teamPlayer: TeamPlayerType;
}

export const TeamPlayer = ({ teamPlayer }: Props) => (
    <Flex direction="column" gap="md">
        <Box pos="relative" style={{ aspectRatio: '1 / 1' }}>
            <PlayerMugshot player={teamPlayer} radius="100%" />
            <PlayerForm form={teamPlayer.form} />
        </Box>
        <Group w="100%" align="center" justify="center" wrap="wrap">
            <PlayerLink player={teamPlayer} year={0} />
            {teamPlayer.outcome.goalie ? (
                <Flex gap="0">
                    <IconHandStop size={24} stroke={1.25} style={{ transform: 'scaleX(-1)' }} />
                    <IconHandStop size={24} stroke={1.25} />
                </Flex>
            ) : null}
        </Group>
    </Flex>
);

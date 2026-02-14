import { Flex, Group } from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';
import { Activity } from 'react';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { TeamPlayerType } from '@/types';

export interface Props {
    teamPlayer: TeamPlayerType;
}

export const TeamPlayer: React.FC<Props> = ({ teamPlayer }) => (
    <Flex direction="column" gap="md">
        <Group justify="space-between" align="center" wrap="wrap">
            <PlayerLink player={teamPlayer} year={0} />
            <Activity mode={teamPlayer.outcome.goalie ? 'visible' : 'hidden'}>
                <IconHandStop size={24} stroke={1.25} />
                <IconHandStop size={24} stroke={1.25} style={{ transform: 'scaleX(-1)' }} />
            </Activity>
        </Group>
        <Flex direction="column" align="center" gap="xs">
        </Flex>
        <PlayerMugshot player={teamPlayer} />
        <PlayerForm form={teamPlayer.form} />
    </Flex>
);

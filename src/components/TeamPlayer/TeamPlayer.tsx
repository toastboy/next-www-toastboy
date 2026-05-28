import { Box, Flex } from '@mantine/core';

import { GoalieIndicator } from '@/components/GoalieIndicator/GoalieIndicator';
import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { PlayerLink } from '@/components/PlayerLink/PlayerLink';
import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { TeamPlayerType } from '@/types';

export interface Props {
    teamPlayer: TeamPlayerType;
}

export const TeamPlayer = ({ teamPlayer }: Props) => (
    <Flex direction="column" gap="0">
        <Box pos="relative" p="12%">
            <PlayerMugshot player={teamPlayer} radius="100%" />
            <PlayerForm form={teamPlayer.form} />
            {teamPlayer.outcome.goalie ? <GoalieIndicator /> : null}
        </Box>
        <PlayerLink player={teamPlayer} year={0} />
    </Flex>
);

import { Flex, Text } from '@mantine/core';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';

import { TeamPlayerType } from '@/types';

export interface Props {
    teamPlayer: TeamPlayerType;
}

const TeamPlayer: React.FC<Props> = ({ teamPlayer }) => (
    <Flex direction="column" gap="md">
        <PlayerLink player={teamPlayer} year={0} />
        <PlayerMugshot player={teamPlayer} />
        <PlayerForm form={teamPlayer.form} />
        <Text>{teamPlayer.outcome.goalie ? "GOALIE!" : ""}</Text>
    </Flex>
);

export default TeamPlayer;

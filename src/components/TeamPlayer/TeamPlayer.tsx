import { Flex, Text } from '@mantine/core';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import { Player } from 'lib/types';

export interface Props {
    player: Player;
    gameDayId: number;
    goalie: boolean | null;
}

const TeamPlayer: React.FC<Props> = ({ player, gameDayId, goalie }) => (
    <Flex direction="column" gap="md">
        <PlayerLink player={player} year={0} />
        <PlayerMugshot player={player} />
        <PlayerForm player={player} gameDayId={gameDayId} games={10} />
        <Text>{goalie ? "GOALIE!" : ""}</Text>
    </Flex>
);

export default TeamPlayer;

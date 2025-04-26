import { Flex, Text } from '@mantine/core';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';

export interface Props {
    playerId: number;
    gameDayId: number;
    goalie: boolean | null;
}

const TeamPlayer: React.FC<Props> = ({ playerId, gameDayId, goalie }) => (
    <Flex direction="column" gap="md">
        <PlayerLink playerId={playerId} year={0} />
        <PlayerMugshot playerId={playerId} />
        <PlayerForm playerId={playerId} gameDayId={gameDayId} games={10} />
        <Text>{goalie ? "GOALIE!" : ""}</Text>
    </Flex>
);

export default TeamPlayer;

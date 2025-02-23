import { Text } from '@mantine/core';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import PlayerLink from 'components/PlayerLink/PlayerLink';
import PlayerMugshot from 'components/PlayerMugshot/PlayerMugshot';
import { Player } from 'lib/types';

export interface Props {
    player: Player;
    goalie: boolean | null;
}

const TeamPlayer: React.FC<Props> = ({ player, goalie }) => (
    // TODO: Change styles to use Mantine components
    // TODO: Need to pass down the proper gameDayId
    <div className="w-[600px] rounded overflow-hidden shadow-lg" key={player.login}>
        <PlayerLink player={player} />
        <PlayerMugshot player={player} />
        <PlayerForm player={player} gameDayId={0} games={10} />
        <Text>{goalie ? "GOALIE!" : ""}</Text>
    </div>
);

export default TeamPlayer;

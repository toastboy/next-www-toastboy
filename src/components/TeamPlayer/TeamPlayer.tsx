'use client';

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
    <div className="w-[600px] rounded overflow-hidden shadow-lg" key={player.login}>
        <PlayerLink idOrLogin={player.login} />
        <PlayerMugshot player={player} />
        <PlayerForm idOrLogin={player.login} games={10} />
        <Text>{goalie ? "GOALIE!" : ""}</Text>
    </div>
);

export default TeamPlayer;

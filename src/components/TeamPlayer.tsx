'use client';

import { Text } from '@mantine/core';
import PlayerForm from 'components/PlayerForm';
import PlayerLink from 'components/PlayerLink';
import PlayerMugshot from 'components/PlayerMugshot';

export interface TeamPlayerProps {
    idOrLogin: string;
    goalie: boolean | null;
}

const TeamPlayer: React.FC<TeamPlayerProps> = ({ idOrLogin, goalie }) => (
    // TODO: Change styles to use Mantine components
    <div className="w-[600px] rounded overflow-hidden shadow-lg" key={idOrLogin}>
        <PlayerLink idOrLogin={idOrLogin} />
        <PlayerMugshot idOrLogin={idOrLogin} />
        <PlayerForm idOrLogin={idOrLogin} games={10} />
        <Text>{goalie ? "GOALIE!" : ""}</Text>
    </div>
);

export default TeamPlayer;

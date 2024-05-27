'use client';

import PlayerMugshot from 'components/PlayerMugshot';
import PlayerForm from 'components/PlayerForm';
import PlayerLink from 'components/PlayerLink';

export interface TeamPlayerProps {
    idOrLogin: string;
    goalie: boolean | null;
}

const TeamPlayer: React.FC<TeamPlayerProps> = ({ idOrLogin, goalie }) => (
    <div className="w-[600px] rounded overflow-hidden shadow-lg" key={idOrLogin}>
        <PlayerLink idOrLogin={idOrLogin} />
        <PlayerMugshot idOrLogin={idOrLogin} />
        <PlayerForm idOrLogin={idOrLogin} games={10} />
        <p>{goalie ? "GOALIE!" : ""}</p>
    </div>
);

export default TeamPlayer;

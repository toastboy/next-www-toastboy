import TeamPlayer from 'components/TeamPlayer/TeamPlayer';
import { Outcome } from 'lib/types';

export interface Props {
    team: Outcome[];
}

const Team: React.FC<Props> = ({ team }) => {
    return (
        // TODO: Change styles to use Mantine components
        <div className="w-[600px] rounded overflow-hidden shadow-lg">
            {team.map((o) => (
                <TeamPlayer key={o.playerId} player={o.player} goalie={o.goalie} />
            ))}
        </div>
    );
};

export default Team;

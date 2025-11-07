import { Props } from '../Team';

const Team = ({ team = [] }: Props) => (
    <>
        {team.map((o) => (
            <div key={o.playerId}>TeamPlayer (Player: {o.playerId}, goalie: {o.goalie ? "true" : "false"})</div>
        ))}
    </>
);
Team.displayName = 'Team';
export default Team;

import { Props } from '../Team';

const Team = ({ team = [] }: Props) => (
    <>
        {team.map((o) => (
            <div key={o.player.id}>TeamPlayer (Player: {o.player.id}, goalie: {o.goalie ? "true" : "false"})</div>
        ))}
    </>
);
Team.displayName = 'Team';
export default Team;

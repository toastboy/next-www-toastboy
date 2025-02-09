import { FootyTeam } from "lib/swr";

const Team = ({ gameDayId, team }: { gameDayId: number, team: FootyTeam }) => (
    <div>Team (gameDayId: {gameDayId}, team: {team})</div>
);
Team.displayName = 'Team';
export default Team;

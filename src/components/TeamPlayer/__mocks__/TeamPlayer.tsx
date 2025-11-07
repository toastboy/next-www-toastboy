import { Props } from '../TeamPlayer';

const TeamPlayer = ({ playerId, gameDayId, goalie }: Props) => (
    <div>TeamPlayer (playerId: {playerId}, gameDayId: {gameDayId}, goalie: {goalie ? "true" : "false"})</div>
);
TeamPlayer.displayName = 'TeamPlayer';
export default TeamPlayer;

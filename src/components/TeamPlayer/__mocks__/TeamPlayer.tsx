import { Player } from "lib/types";

const TeamPlayer = ({ player, goalie }: { player: Player, goalie: boolean }) => (
    <div>TeamPlayer (id: {player.id}, goalie: {goalie.toString()})</div>
);
TeamPlayer.displayName = 'TeamPlayer';
export default TeamPlayer;

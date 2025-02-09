const TeamPlayer = ({ idOrLogin, goalie }: { idOrLogin: string, goalie: boolean }) => (
    <div>TeamPlayer (idOrLogin: {idOrLogin}, goalie: {goalie.toString()})</div>
);
TeamPlayer.displayName = 'TeamPlayer';
export default TeamPlayer;

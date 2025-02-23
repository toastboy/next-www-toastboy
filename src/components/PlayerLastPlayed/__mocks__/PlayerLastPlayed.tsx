import { Props } from '../PlayerLastPlayed';

const PlayerLastPlayed = ({ player }: Props) => (
    <div>PlayerLastPlayed (id: {player.id})</div>
);
PlayerLastPlayed.displayName = 'PlayerLastPlayed';
export default PlayerLastPlayed;

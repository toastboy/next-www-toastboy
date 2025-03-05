import { Props } from '../PlayerPositions';

const PlayerPositions = ({ player, year }: Props) => (
    <div>PlayerPositions (player: {player.id}, year: {year})</div>
);
PlayerPositions.displayName = 'PlayerPositions';
export default PlayerPositions;

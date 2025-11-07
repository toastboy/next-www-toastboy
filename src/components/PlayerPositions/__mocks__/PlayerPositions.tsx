import { Props } from '../PlayerPositions';

const PlayerPositions = ({ playerId, year }: Props) => (
    <div>PlayerPositions (playerId: {playerId}, year: {year})</div>
);
PlayerPositions.displayName = 'PlayerPositions';
export default PlayerPositions;

import { Props } from '../PlayerTrophies';

const PlayerTrophies = ({ playerId, year }: Props) => (
    <div>PlayerTrophies (playerId: {playerId}, year: {year})</div>
);
PlayerTrophies.displayName = 'PlayerTrophies';
export default PlayerTrophies;

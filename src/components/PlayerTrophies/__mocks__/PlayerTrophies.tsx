import { Props } from '../PlayerTrophies';

const PlayerTrophies = ({ player, year }: Props) => (
    <div>PlayerTrophies (player: {player.id}, year: {year})</div>
);
PlayerTrophies.displayName = 'PlayerTrophies';
export default PlayerTrophies;

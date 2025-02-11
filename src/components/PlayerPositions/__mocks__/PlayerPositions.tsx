import { Props } from '../PlayerPositions';

const PlayerPositions = ({ idOrLogin, year }: Props) => (
    <div>PlayerPositions (idOrLogin: {idOrLogin}, year: {year})</div>
);
PlayerPositions.displayName = 'PlayerPositions';
export default PlayerPositions;

import { Props } from '../PlayerResults';

const PlayerResults = ({ playerId, year }: Props) => (
    <div>PlayerResults (playerId: {playerId}, year: {year})</div>
);
PlayerResults.displayName = 'PlayerResults';
export default PlayerResults;

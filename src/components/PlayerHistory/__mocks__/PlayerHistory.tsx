import { Props } from '../PlayerHistory';

const PlayerHistory = ({ playerId, year }: Props) => (
    <div>PlayerHistory (playerId: {playerId}, year: {year})</div>
);
PlayerHistory.displayName = 'PlayerHistory';
export default PlayerHistory;

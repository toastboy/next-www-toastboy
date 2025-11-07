import { Props } from '../PlayerForm';

const PlayerForm = ({ playerId, gameDayId, games }: Props) => (
    <div>PlayerForm (playerId: {playerId}, gameDayId: {gameDayId}, games: {games})</div>
);
PlayerForm.displayName = 'PlayerForm';
export default PlayerForm;

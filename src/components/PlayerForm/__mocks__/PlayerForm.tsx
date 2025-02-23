import { Props } from '../PlayerForm';

const PlayerForm = ({ player, gameDayId, games }: Props) => (
    <div>PlayerForm (player: {player.id}, gameDayId: {gameDayId}, games: {games})</div>
);
PlayerForm.displayName = 'PlayerForm';
export default PlayerForm;

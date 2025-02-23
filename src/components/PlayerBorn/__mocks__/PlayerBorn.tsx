import { Props } from '../PlayerBorn';

const PlayerBorn = ({ player }: Props) => (
    <div>PlayerBorn (player: {player.id})</div>
);
PlayerBorn.displayName = 'PlayerBorn';
export default PlayerBorn;

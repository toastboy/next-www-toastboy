import { Props } from '../PlayerBorn';

const PlayerBorn = ({ playerId }: Props) => (
    <div>PlayerBorn (playerId: {playerId})</div>
);
PlayerBorn.displayName = 'PlayerBorn';
export default PlayerBorn;

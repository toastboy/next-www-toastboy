import { Props } from '../PlayerBorn';

const PlayerBorn = (props: Props) => (
    <div>PlayerBorn: {JSON.stringify(props)}</div>
);
PlayerBorn.displayName = 'PlayerBorn';
export default PlayerBorn;

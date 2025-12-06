import { Props } from '../PlayerTrophies';

const PlayerTrophies = (props: Props) => (
    <div>PlayerTrophies: {JSON.stringify(props)}</div>
);
PlayerTrophies.displayName = 'PlayerTrophies';
export default PlayerTrophies;

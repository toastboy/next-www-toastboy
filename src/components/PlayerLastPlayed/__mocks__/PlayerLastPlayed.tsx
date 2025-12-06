import { Props } from '../PlayerLastPlayed';

const PlayerLastPlayed = (props: Props) => (
    <div>PlayerLastPlayed: {JSON.stringify(props)}</div>
);
PlayerLastPlayed.displayName = 'PlayerLastPlayed';
export default PlayerLastPlayed;

import { Props } from '../PlayerClubs';

const PlayerClubs = (props: Props) => (
    <div>PlayerClubs: {JSON.stringify(props)}</div>
);
PlayerClubs.displayName = 'PlayerClubs';
export default PlayerClubs;

import { Props } from '../PlayerHistory';

const PlayerHistory = (props: Props) => (
    <div>PlayerHistory: {JSON.stringify(props)}</div>
);
PlayerHistory.displayName = 'PlayerHistory';
export default PlayerHistory;

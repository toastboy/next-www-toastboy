import { Props } from '../PlayerHistory';

export const PlayerHistory = (props: Props) => (
    <div>PlayerHistory: {JSON.stringify(props)}</div>
);
PlayerHistory.displayName = 'PlayerHistory';

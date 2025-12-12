import { Props } from '../PlayerLastPlayed';

export const PlayerLastPlayed = (props: Props) => (
    <div>PlayerLastPlayed: {JSON.stringify(props)}</div>
);
PlayerLastPlayed.displayName = 'PlayerLastPlayed';

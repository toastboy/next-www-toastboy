import { Props } from '../TeamPlayer';

export const TeamPlayer = (props: Props) => (
    <div>TeamPlayer: {JSON.stringify(props)}</div>
);
TeamPlayer.displayName = 'TeamPlayer';

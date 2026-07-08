import type { Props } from '../PlayerInfo';

export const PlayerInfo = (props: Props) => (
    <div>PlayerInfo: {JSON.stringify(props)}</div>
);
PlayerInfo.displayName = 'PlayerInfo';

import { Props } from '../PlayerList';

export const PlayerList = (props: Props) => (
    <div>PlayerList: {JSON.stringify(props)}</div>
);
PlayerList.displayName = 'PlayerList';

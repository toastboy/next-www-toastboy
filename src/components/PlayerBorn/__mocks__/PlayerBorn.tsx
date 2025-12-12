import { Props } from '../PlayerBorn';

export const PlayerBorn = (props: Props) => (
    <div>PlayerBorn: {JSON.stringify(props)}</div>
);
PlayerBorn.displayName = 'PlayerBorn';

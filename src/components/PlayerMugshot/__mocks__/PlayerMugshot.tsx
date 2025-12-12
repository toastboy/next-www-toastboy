import { Props } from '../PlayerMugshot';

export const PlayerMugshot = (props: Props) => (
    <div>PlayerMugshot: {JSON.stringify(props)}</div>
);
PlayerMugshot.displayName = 'PlayerMugshot';

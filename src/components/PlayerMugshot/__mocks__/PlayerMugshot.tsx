import { Props } from '../PlayerMugshot';

const PlayerMugshot = (props: Props) => (
    <div>PlayerMugshot: {JSON.stringify(props)}</div>
);
PlayerMugshot.displayName = 'PlayerMugshot';
export default PlayerMugshot;

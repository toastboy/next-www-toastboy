import { Props } from '../PlayerTimeline';

const PlayerTimeline = (props: Props) => (
    <div>PlayerTimeline: {JSON.stringify(props)}</div>
);
PlayerTimeline.displayName = 'PlayerTimeline';
export default PlayerTimeline;

import { Props } from '../PlayerTimeline';

export const PlayerTimeline = (props: Props) => (
    <div>PlayerTimeline: {JSON.stringify(props)}</div>
);
PlayerTimeline.displayName = 'PlayerTimeline';

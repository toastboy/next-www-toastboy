import { Props } from '../PlayerLink';

export const PlayerLink = (props: Props) => (
    <div>PlayerLink: {JSON.stringify(props)}</div>
);
PlayerLink.displayName = 'PlayerLink';

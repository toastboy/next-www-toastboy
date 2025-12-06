import { Props } from '../PlayerLink';

const PlayerLink = (props: Props) => (
    <div>PlayerLink: {JSON.stringify(props)}</div>
);
PlayerLink.displayName = 'PlayerLink';
export default PlayerLink;

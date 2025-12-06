import { Props } from '../ClubBadge';

const ClubBadge = (props: Props) => (
    <div>ClubBadge: {JSON.stringify(props)}</div>
);
ClubBadge.displayName = 'ClubBadge';
export default ClubBadge;

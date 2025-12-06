import { Props } from '../PlayerProfile';

const PlayerProfile = (props: Props) => (
    <div>PlayerProfile: {JSON.stringify(props)}</div>
);
PlayerProfile.displayName = 'PlayerProfile';
export default PlayerProfile;

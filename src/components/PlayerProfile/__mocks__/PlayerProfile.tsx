import { Props } from '../PlayerProfile';

export const PlayerProfile = (props: Props) => (
    <div>PlayerProfile: {JSON.stringify(props)}</div>
);
PlayerProfile.displayName = 'PlayerProfile';

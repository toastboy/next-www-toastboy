import { Props } from '../PlayerProfile';

export const PlayerProfile = ({ onSendEmail: _onSendEmail, ...props }: Props) => (
    <div>PlayerProfile: {JSON.stringify(props)}</div>
);
PlayerProfile.displayName = 'PlayerProfile';

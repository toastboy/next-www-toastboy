import { Props } from '../PlayerProfile';

const PlayerProfile = ({ player }: Props) => (
    <div>PlayerProfile (player: {player.id})</div>
);
PlayerProfile.displayName = 'PlayerProfile';
export default PlayerProfile;

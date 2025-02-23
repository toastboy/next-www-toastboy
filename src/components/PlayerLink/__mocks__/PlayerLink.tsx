import { Props } from '../PlayerLink';

const PlayerLink = ({ player }: Props) => (
    <div>PlayerLink (player: {player.id})</div>
);
PlayerLink.displayName = 'PlayerLink';
export default PlayerLink;

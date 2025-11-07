import { Props } from '../PlayerMugshot';

const PlayerMugshot = ({ playerId }: Props) => (
    <div>PlayerMugshot (id: {playerId})</div>
);
PlayerMugshot.displayName = 'PlayerMugshot';
export default PlayerMugshot;

import { Player } from 'src/lib/types';

const PlayerMugshot = ({ player }: { player: Player }) => (
    <div>PlayerMugshot (id: {player.id})</div>
);
PlayerMugshot.displayName = 'PlayerMugshot';
export default PlayerMugshot;

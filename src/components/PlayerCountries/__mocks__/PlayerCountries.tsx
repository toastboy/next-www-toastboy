import { Props } from '../PlayerCountries';

const PlayerCountries = ({ player }: Props) => (
    <div>PlayerCountries (player: {player.id})</div>
);
PlayerCountries.displayName = 'PlayerCountries';
export default PlayerCountries;

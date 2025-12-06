import { Props } from '../PlayerCountries';

const PlayerCountries = (props: Props) => (
    <div>PlayerCountries: {JSON.stringify(props)}</div>
);
PlayerCountries.displayName = 'PlayerCountries';
export default PlayerCountries;

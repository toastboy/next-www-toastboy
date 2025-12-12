import { Props } from '../PlayerCountries';

export const PlayerCountries = (props: Props) => (
    <div>PlayerCountries: {JSON.stringify(props)}</div>
);
PlayerCountries.displayName = 'PlayerCountries';

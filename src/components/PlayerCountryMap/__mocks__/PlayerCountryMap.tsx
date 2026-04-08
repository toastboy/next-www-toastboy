import { Props } from '../PlayerCountryMap';

export const PlayerCountryMap = (props: Props) => (
    <div data-testid="player-country-map">PlayerCountryMap: {JSON.stringify(props)}</div>
);
PlayerCountryMap.displayName = 'PlayerCountryMap';

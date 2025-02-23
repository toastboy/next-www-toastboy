import { Props } from '../CountryFlag';

const CountryFlag = ({ country }: Props) => (
    <div>CountryFlag (country: {country.isoCode})</div>
);
CountryFlag.displayName = 'CountryFlag';
export default CountryFlag;

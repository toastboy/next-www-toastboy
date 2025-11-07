import { Props } from '../CountryFlag';

const CountryFlag = ({ countryISOCode }: Props) => (
    <div>CountryFlag (countryISOCode: {countryISOCode})</div>
);
CountryFlag.displayName = 'CountryFlag';
export default CountryFlag;

import { Props } from '../CountryFlag';

const CountryFlag = (props: Props) => (
    <div>CountryFlag: {JSON.stringify(props)}</div>
);
CountryFlag.displayName = 'CountryFlag';
export default CountryFlag;

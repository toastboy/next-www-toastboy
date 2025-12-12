import { Props } from '../CountryFlag';

export const CountryFlag = (props: Props) => (
    <div>CountryFlag: {JSON.stringify(props)}</div>
);
CountryFlag.displayName = 'CountryFlag';

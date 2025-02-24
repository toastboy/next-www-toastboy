import { Props } from "../YearSelector";

const YearSelector = ({ activeYear, validYears }: Props) => (
    <div>YearSelector (activeYear: {activeYear}, validYears: {validYears})</div>
);
YearSelector.displayName = 'YearSelector';
export default YearSelector;

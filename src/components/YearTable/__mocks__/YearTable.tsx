import { Props } from '../YearTable';

const YearTable = (props: Props) => (
    <div>YearTable: {JSON.stringify(props)}</div>
);
YearTable.displayName = 'YearTable';
export default YearTable;

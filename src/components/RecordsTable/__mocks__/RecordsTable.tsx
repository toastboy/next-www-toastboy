import { Props } from '../RecordsTable';

export const RecordsTable = (props: Props) => (
    <div>RecordsTable: {JSON.stringify(props)}</div>
);
RecordsTable.displayName = 'RecordsTable';

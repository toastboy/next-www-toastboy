import { Props } from '../WinnersTable';

const WinnersTable = (props: Props) => (
    <div>WinnersTable: {JSON.stringify(props)}</div>
);
WinnersTable.displayName = 'WinnersTable';
export default WinnersTable;

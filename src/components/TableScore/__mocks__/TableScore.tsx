import { Props } from '../TableScore';

const TableScore = (props: Props) => (
    <div>TableScore: {JSON.stringify(props)}</div>
);
TableScore.displayName = 'TableScore';
export default TableScore;

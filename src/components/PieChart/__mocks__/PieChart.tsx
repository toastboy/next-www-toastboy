import { Props } from '../PieChart';

const PieChart = (props: Props) => (
    <div>PieChart: {JSON.stringify(props)}</div>
);
PieChart.displayName = 'PieChart';
export default PieChart;

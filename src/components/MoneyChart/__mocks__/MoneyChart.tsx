import { Props } from '../MoneyChart';

export const MoneyChart = (props: Props) => (
    <div>MoneyChart: {JSON.stringify(props)}</div>
);
MoneyChart.displayName = 'MoneyChart';

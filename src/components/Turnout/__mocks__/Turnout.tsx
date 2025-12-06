import { Props } from '../Turnout';

const Turnout = (props: Props) => (
    <div>Turnout: {JSON.stringify(props)}</div>
);
Turnout.displayName = 'Turnout';
export default Turnout;

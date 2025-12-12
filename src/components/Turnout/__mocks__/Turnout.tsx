import { Props } from '../Turnout';

export const Turnout = (props: Props) => (
    <div>Turnout: {JSON.stringify(props)}</div>
);
Turnout.displayName = 'Turnout';

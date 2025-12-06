import { Props } from '../MustBeLoggedIn';

const MustBeLoggedIn = (props: Props) => (
    <div>MustBeLoggedIn: {JSON.stringify(props)}</div>
);
MustBeLoggedIn.displayName = 'MustBeLoggedIn';
export default MustBeLoggedIn;

import { Props } from '../MustBeLoggedIn';

export const MustBeLoggedIn = (props: Props) => (
    <div>MustBeLoggedIn: {JSON.stringify(props)}</div>
);
MustBeLoggedIn.displayName = 'MustBeLoggedIn';

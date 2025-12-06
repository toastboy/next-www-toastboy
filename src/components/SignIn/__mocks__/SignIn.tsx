import { Props } from '../SignIn';

const SignIn = (props: Props) => (
    <div>SignIn: {JSON.stringify(props)}</div>
);
SignIn.displayName = 'SignIn';
export default SignIn;

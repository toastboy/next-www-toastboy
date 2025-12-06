import { Props } from '../UserButton';

const UserButton = (props: Props) => (
    <div>UserButton: {JSON.stringify(props)}</div>
);
UserButton.displayName = 'UserButton';
export default UserButton;

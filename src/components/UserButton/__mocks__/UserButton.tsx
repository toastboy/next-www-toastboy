import { Props } from '../UserButton';

export const UserButton = (props: Props) => (
    <div>UserButton: {JSON.stringify(props)}</div>
);
UserButton.displayName = 'UserButton';

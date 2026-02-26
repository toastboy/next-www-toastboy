import type { Props } from '../AdminUserData';

export const AdminUserData = (props: Props) => (
    <div>AdminUserData: {JSON.stringify(props)}</div>
);

AdminUserData.displayName = 'AdminUserData';

export default AdminUserData;

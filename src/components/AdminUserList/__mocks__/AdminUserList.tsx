import type { Props } from '../AdminUserList';

export const AdminUserList = (props: Props) => (
    <div>AdminUserList: {JSON.stringify(props)}</div>
);

AdminUserList.displayName = 'AdminUserList';

export default AdminUserList;

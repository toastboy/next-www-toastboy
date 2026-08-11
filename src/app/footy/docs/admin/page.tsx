import type { Metadata } from 'next';

import AdminContent from './admin.mdx';

export const metadata: Metadata = { title: 'Admin Documentation' };

const AdminPage = () => <AdminContent />;

export default AdminPage;

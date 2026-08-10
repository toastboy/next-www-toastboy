import { Container } from '@mantine/core';
import type { Metadata } from 'next';

import AdminContent from './admin.mdx';

export const metadata: Metadata = { title: 'Admin Documentation' };

const AdminPage = () => (
    <Container py="xl">
        <AdminContent />
    </Container>
);

export default AdminPage;

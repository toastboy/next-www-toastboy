import type { ReactNode } from 'react';

import { SignIn } from '@/components/SignIn/SignIn';
import { getUserRole } from '@/lib/authServer';

interface AdminLayoutProps {
    children: ReactNode;
}

/**
 * Server-side guard for all admin routes.
 *
 * @param props - Layout props.
 * @param props.children - Child routes under /footy/admin.
 * @returns Guarded admin layout content.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
    const role = await getUserRole();

    if (role !== 'admin') {
        return <SignIn admin={true} />;
    }

    return children;
}

import type { ReactNode } from 'react';

import { SignIn } from '@/components/SignIn/SignIn';
import { getUserRole } from '@/lib/authServer';

interface AuthenticatedLayoutProps {
    children: ReactNode;
}

/**
 * Server-side guard for all authenticated routes.
 *
 * @param props - Layout props.
 * @param props.children - Child routes under /footy/(authenticated).
 * @returns Guarded authenticated layout content.
 */
export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const role = await getUserRole();

    if (role === 'none') {
        return <SignIn admin={false} />;
    }

    return children;
}

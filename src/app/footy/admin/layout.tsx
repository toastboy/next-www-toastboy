import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getUserRole } from '@/lib/auth.server';

interface AdminLayoutProps {
    children: ReactNode;
}

/**
 * Server component that enforces admin authentication for the admin section.
 *
 * This layout checks the current user's role using `getUserRole()`. If the user is not an admin,
 * it redirects them to the admin sign-in page, preserving the current pathname for post-login redirection.
 * If the user is an admin, it renders the provided children components.
 *
 * @param {AdminLayoutProps} props - The props object containing the `children` to render.
 * @returns The rendered children if the user is an admin, otherwise triggers a redirect.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
    const role = await getUserRole();

    if (role !== 'admin') {
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') ?? '/footy/admin';
        redirect(`/footy/auth/signin?admin=true&redirect=${encodeURIComponent(pathname)}`);
    }

    return children;
}

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getUserRole } from '@/lib/auth.server';

interface AuthenticatedLayoutProps {
    children: ReactNode;
}

/**
 * An asynchronous layout component that wraps authenticated routes within the Footy app.
 * 
 * This layout checks the current user's role using `getUserRole()`. If the user is not authenticated
 * (i.e., their role is `'none'`), it redirects them to the sign-in page, preserving the current pathname
 * for post-authentication redirection.
 * 
 * @param {AuthenticatedLayoutProps} props - The props for the layout, including the `children` to render.
 * @returns {Promise<React.ReactNode>} The rendered children if the user is authenticated, otherwise triggers a redirect.
 */
export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const role = await getUserRole();

    if (role === 'none') {
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') ?? '/footy/profile';
        redirect(`/footy/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    }

    return children;
}

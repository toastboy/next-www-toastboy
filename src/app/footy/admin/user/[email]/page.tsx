'use server';

import { notFound } from 'next/navigation';

import { listUsersAction } from '@/actions/auth';
import { AdminUserData } from '@/components/AdminUserData/AdminUserData';
import { captureUnexpectedError } from '@/lib/observability/sentry';

interface PageProps {
    params: Promise<{ email: string }>,
}

const Page: React.FC<PageProps> = async (props) => {
    const { email } = await props.params;
    let user;

    try {
        const response = await listUsersAction(decodeURIComponent(email));
        user = response?.[0];
    }
    catch (error) {
        captureUnexpectedError(error, {
            layer: 'server',
            action: 'listUsersAction',
            component: 'AdminUserPage',
            route: '/footy/admin/user/[email]',
            extra: {
                email,
            },
        });
    }

    if (!user) return notFound();

    return (
        <AdminUserData user={user} />
    );
};

export default Page;

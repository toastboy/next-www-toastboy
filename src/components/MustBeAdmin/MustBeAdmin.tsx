'use client';

import { SignIn } from 'components/SignIn/SignIn';
import { authClient } from 'lib/authClient';
import { ReactNode, Suspense, useEffect, useState } from 'react';

type Props = {
    children: ReactNode;
};

function MustBeAdmin({ children }: Props) {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const session = authClient.useSession();

    useEffect(() => {
        const checkAdmin = async () => {
            const adminStatus = await authClient.isAdmin();
            setIsAdmin(adminStatus);
        };
        checkAdmin();
    }, [session?.data?.user]);

    if (isAdmin === null) {
        // While the admin status is being determined, render nothing to allow loading.tsx to take over.
        return null;
    }

    if (!isAdmin) {
        return <SignIn title="You must be logged in as an administrator to use this page." />;
    }

    return (
        <Suspense>
            {children}
        </Suspense>
    );
}

export default MustBeAdmin;

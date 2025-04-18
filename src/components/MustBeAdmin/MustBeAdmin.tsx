'use client';

import { SignIn } from 'components/SignIn/SignIn';
import { authClient } from 'lib/authClient';
import { ReactNode, Suspense, useEffect, useState } from 'react';

type Props = {
    children: ReactNode;
};

function MustBeAdmin({ children }: Props) {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const adminStatus = await authClient.isAdmin();
            setIsAdmin(adminStatus);
        };
        checkAdmin();
    }, []); // TODO: When the session changes, this should be re-checked.

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

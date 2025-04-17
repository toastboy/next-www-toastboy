'use client';

import { SignIn } from 'components/SignIn/SignIn';
import { authClient } from 'lib/authClient';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

function MustBeAdmin({ children }: Props) {
    if (!authClient.isAdmin()) {
        return <SignIn title="You must be logged in as an administrator to use this page." />;
    }

    return <>{children}</>;
};

export default MustBeAdmin;

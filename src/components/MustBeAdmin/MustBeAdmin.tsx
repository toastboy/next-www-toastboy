import { SignIn } from 'components/SignIn/SignIn';
import { headers } from "next/headers";
import { ReactNode } from 'react';
import { authClient } from 'src/lib/auth-client';

type Props = {
    children: ReactNode;
};

async function MustBeAdmin({ children }: Props) {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });

    if (!session || !session.data || session.data.user.role !== "admin") {
        return <SignIn title="You must be logged in as an administrator to use this page." />;
    }

    return <>{children}</>;
};

export default MustBeAdmin;

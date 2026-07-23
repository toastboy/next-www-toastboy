import { Paper } from '@mantine/core';

import { SignIn } from '@/components/SignIn/SignIn';

export const metadata = { title: 'Sign In' };

interface PageProps {
    searchParams: Promise<{ redirect?: string; admin?: string }>;
}

const SignInPage = async ({ searchParams }: PageProps) => {
    const { redirect, admin } = await searchParams;
    const adminProp = admin === 'true' ? true : admin === 'false' ? false : undefined;

    return (
        <Paper w="100%" maw="35rem" p="xl">
            <SignIn redirect={redirect ?? '/footy/profile'} admin={adminProp} />
        </Paper>
    );
};

export default SignInPage;

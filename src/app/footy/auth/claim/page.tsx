import { Paper } from '@mantine/core';

import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

interface PageProps {
    searchParams?: Promise<{
        name?: string;
        email?: string;
        token?: string;
    }>;
}

export const metadata = { title: 'Sign Up' };

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { name, email, token } = searchParams ?? {};

    // TODO: Work out whether things like this <Paper> should be in the page or
    // in the component. This will probably best be done when I work on using
    // <Container> where appropriate, and then I can see if it makes sense to
    // have the <Paper> in the page or in the component.

    return (
        <Paper w="100%" maw="35rem" p="xl">
            <ClaimSignup
                name={name ?? ''}
                email={email ?? ''}
                token={token ?? ''}
            />
        </Paper>
    );
};

export default Page;

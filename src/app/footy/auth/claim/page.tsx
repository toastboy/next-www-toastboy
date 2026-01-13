import { redirect } from 'next/navigation';

import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

interface PageProps {
    searchParams?: Promise<{
        name?: string;
        email?: string;
        token?: string;
        error?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const { name, email, token, error } = searchParams ?? {};
    let errorMessage: string | undefined;

    if (!errorMessage && (!email || !name || !token)) {
        errorMessage = 'Missing required invitation details.';
    }

    if (errorMessage && !error) {
        const params = new URLSearchParams(searchParams ?? {});
        params.set('error', errorMessage);
        redirect(`/footy/auth/claim?${params.toString()}`);
    }

    return (
        <ClaimSignup
            name={name ?? ''}
            email={email ?? ''}
            token={token ?? ''}
        />
    );
};

export default Page;

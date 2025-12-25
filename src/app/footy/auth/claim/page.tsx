import Link from 'next/link';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';
    let email: string | null = null;
    let errorMessage: string | null = null;

    try {
        const result = await claimPlayerInvitation(token);
        email = result.email;
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unable to claim invitation.';
    }

    if (errorMessage) {
        return (
            <main>
                <h1>Invitation problem</h1>
                <p>{errorMessage}</p>
                <p>
                    <Link href="/footy/auth/signup">Go to sign up</Link>
                </p>
            </main>
        );
    }

    const signupLink = email
        ? `/footy/auth/signup?email=${encodeURIComponent(email)}`
        : '/footy/auth/signup';

    return (
        <main>
            <h1>Invitation claimed</h1>
            <p>Your email address has been verified.</p>
            <p>
                <Link href={signupLink}>Continue to sign up</Link>
            </p>
        </main>
    );
};

export default Page;

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { ClaimSignup } from '@/components/ClaimSignup/ClaimSignup';

interface PageProps {
    searchParams?: Promise<{
        token?: string;
        redirect?: string;
    }>;
}

const Page = async ({ searchParams: sp }: PageProps) => {
    const searchParams = await sp;
    const token = searchParams?.token ?? '';
    // TODO: Redirect to player profile
    const redirect = searchParams?.redirect ?? '/footy/info';
    let name: string | null = null;
    let email: string | null = null;
    let errorMessage: string | null = null;

    try {
        const result = await claimPlayerInvitation(token);
        name = result.player.name;
        email = result.email;
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unable to claim invitation.';
    }

    if (errorMessage) {
        // TODO: Improve error UI/UX
        return (
            <main>
                <h1>Invitation problem</h1>
                <p>{errorMessage}</p>
            </main>
        );
    }

    if (!email || !name) {
        // TODO: Improve error UI/UX
        return (
            <main>
                <h1>Invitation problem</h1>
                <p>Invitation is missing required details.</p>
            </main>
        );
    }

    return (
        <ClaimSignup
            name={name}
            email={email}
            redirect={redirect}
        />
    );
};

export default Page;

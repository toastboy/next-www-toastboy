import { SignIn } from '@/components/SignIn/SignIn';

export const metadata = { title: 'Sign In' };

interface PageProps {
    searchParams: Promise<{ redirect?: string; admin?: string }>;
}

const SignInPage = async ({ searchParams }: PageProps) => {
    const { redirect, admin } = await searchParams;
    const adminProp = admin === 'true' ? true : admin === 'false' ? false : undefined;

    return (
        <SignIn redirect={redirect ?? '/footy/profile'} admin={adminProp} />
    );
};

export default SignInPage;

import { SignIn } from '@/components/SignIn/SignIn';

export const metadata = { title: 'Sign In' };

const SignInPage = () => {
    return (
        <SignIn redirect='/footy/profile' />
    );
};

export default SignInPage;

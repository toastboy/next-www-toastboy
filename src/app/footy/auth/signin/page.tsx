import { SignIn } from '@/components/SignIn/SignIn';

type PageProps = object

export const metadata = { title: 'Sign In' };

const Page: React.FC<PageProps> = () => {
    return (
        <SignIn redirect='/footy/profile' />
    );
};

export default Page;

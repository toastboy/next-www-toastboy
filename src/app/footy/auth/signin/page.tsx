import { SignIn } from '@/components/SignIn/SignIn';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <SignIn redirect='/footy/info' />
    );
};

export default Page;

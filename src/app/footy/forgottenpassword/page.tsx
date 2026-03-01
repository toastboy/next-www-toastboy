
import { ForgottenPasswordForm } from '@/components/ForgottenPasswordForm/ForgottenPasswordForm';

type PageProps = object;

export const metadata = { title: 'Forgotten Password' };

const Page: React.FC<PageProps> = () => {
    return (
        <ForgottenPasswordForm />
    );
};

export default Page;

import { Metadata } from 'next';

import { ForgottenPasswordForm } from '@/components/ForgottenPasswordForm/ForgottenPasswordForm';

type PageProps = object;

export const metadata: Metadata = {
    title: 'Toastboy FC: Forgotten Password',
};

const Page: React.FC<PageProps> = () => {
    return (
        <ForgottenPasswordForm />
    );
};

export default Page;

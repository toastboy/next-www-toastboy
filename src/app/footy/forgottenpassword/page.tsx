import { Metadata } from 'next';

import { PasswordResetForm } from '@/components/PasswordResetForm/PasswordResetForm';

type PageProps = object;

export const metadata: Metadata = {
    title: 'Toastboy FC: Forgotten Password',
};

const Page: React.FC<PageProps> = () => {
    return (
        <PasswordResetForm />
    );
};

export default Page;

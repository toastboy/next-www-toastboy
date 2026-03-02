import { PasswordChangeForm } from '@/components/PasswordChangeForm/PasswordChangeForm';

type PageProps = object

export const metadata = { title: 'Change Password' };

const Page: React.FC<PageProps> = () => {
    return (
        <PasswordChangeForm />
    );
};

export default Page;

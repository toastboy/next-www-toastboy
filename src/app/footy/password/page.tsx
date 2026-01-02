import { MustBeLoggedIn } from '@/components/MustBeLoggedIn/MustBeLoggedIn';
import { PasswordChangeForm } from '@/components/PasswordChangeForm/PasswordChangeForm';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <MustBeLoggedIn admin={false}>
            <PasswordChangeForm />
        </MustBeLoggedIn>
    );
};

export default Page;

import { deletePlayer } from '@/actions/deletePlayer';
import { DeleteAccountForm } from '@/components/DeleteAccountForm/DeleteAccountForm';

type PageProps = object

export const metadata = { title: 'Delete Account' };

const Page: React.FC<PageProps> = () => {
    return (
        <DeleteAccountForm onDeletePlayer={deletePlayer} />
    );
};

export default Page;

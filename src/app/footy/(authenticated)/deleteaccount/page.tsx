import { deletePlayer } from '@/actions/deletePlayer';
import { DeleteAccountForm } from '@/components/DeleteAccountForm/DeleteAccountForm';

type PageProps = object

const Page: React.FC<PageProps> = () => {
    return (
        <DeleteAccountForm onDeletePlayer={deletePlayer} />
    );
};

export default Page;

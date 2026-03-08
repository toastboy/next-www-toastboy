import { deletePlayer } from '@/actions/deletePlayer';
import { DeleteAccountForm } from '@/components/DeleteAccountForm/DeleteAccountForm';

export const metadata = { title: 'Delete Account' };

const DeleteAccountPage = () => {
    return (
        <DeleteAccountForm onDeletePlayer={deletePlayer} />
    );
};

export default DeleteAccountPage;

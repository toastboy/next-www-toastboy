import AdminUpdatePlayerRecords from 'components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import MustBeLoggedIn from 'components/MustBeLoggedIn/MustBeLoggedIn';

const Page: React.FC = () => {
    return (
        <MustBeLoggedIn admin={true}>
            <AdminUpdatePlayerRecords />
        </MustBeLoggedIn>
    );
};

export default Page;

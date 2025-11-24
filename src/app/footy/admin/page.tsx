import AdminExportAuth from 'components/AdminExportAuth/AdminExportAuth';
import AdminUpdatePlayerRecords from 'components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import MustBeLoggedIn from 'components/MustBeLoggedIn/MustBeLoggedIn';

const Page: React.FC = () => {
    return (
        <MustBeLoggedIn admin={true}>
            <AdminUpdatePlayerRecords />
            <AdminExportAuth />
        </MustBeLoggedIn>
    );
};

export default Page;
